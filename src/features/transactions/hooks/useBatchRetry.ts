'use client';

import { useCallback, useRef, useState, useTransition, useEffect } from 'react';
import { TransactionService } from '../api/transaction.service';
import { runWithLimit } from '../utils';
import type { TransactionStatus } from '../types';

export function useBatchRetry(onUpdate: (id: string, status: TransactionStatus) => void) {
  const [activeRetryIds, setActiveRetryIds] = useState<ReadonlySet<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  
  // Senior Move: Store the callback in a ref to prevent unnecessary effect 
  // re-runs or logic re-evaluations if the parent passes an anonymous function.
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const controllers = useRef(new Map<string, AbortController>());
  const retryVersions = useRef(new Map<string, number>());

  useEffect(() => {
    return () => {
      controllers.current.forEach(c => c.abort());
      controllers.current.clear();
    };
  }, []);

  const retryBatch = useCallback(async (ids: string[]): Promise<(TransactionStatus | 'cancelled')[]> => {
    if (!ids.length) return [];

    // Bump version per ID before workers start so a newer batch can invalidate an older one.
    const myVersions = new Map<string, number>();
    ids.forEach(id => {
      const v = (retryVersions.current.get(id) ?? 0) + 1;
      retryVersions.current.set(id, v);
      myVersions.set(id, v);
    });

    startTransition(() => {
      setActiveRetryIds(prev => new Set([...prev, ...ids]));
      ids.forEach(id => onUpdateRef.current(id, 'processing'));
    });

    return runWithLimit(ids, 3, async (id) => {
      const myVersion = myVersions.get(id)!;
      const controller = new AbortController();
      controllers.current.set(id, controller);

      try {
        const status = await TransactionService.retryPayment(id, controller.signal);

        if (!controller.signal.aborted && retryVersions.current.get(id) === myVersion) {
          onUpdateRef.current(id, status);
        }
        return status;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return 'cancelled';

        if (retryVersions.current.get(id) === myVersion) {
          onUpdateRef.current(id, 'failed');
        }
        return 'failed';
      } finally {
        if (controllers.current.get(id) === controller) {
          controllers.current.delete(id);
        }
        startTransition(() => {
          setActiveRetryIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        });
      }
    });
  }, []);

  const cancelAll = useCallback(() => {
    controllers.current.forEach(c => c.abort());
    controllers.current.clear();
  }, []);

  return { retryBatch, activeRetryIds, isPending, cancelAll };
}