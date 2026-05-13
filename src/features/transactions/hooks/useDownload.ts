'use client';

import { useCallback, useState } from 'react';
import { TransactionService } from '../api/transaction.service';
import { texts } from '../constants/texts';
import type { Toast } from '../types';

type PushToast = (message: string, type?: Toast['type']) => void;

export function useDownload(pushToast: PushToast) {
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(() => new Set());

  const onDownload = useCallback(async (id: string) => {
    setDownloadingIds((prev) => new Set(prev).add(id));
    try {
      const blob = await TransactionService.generateInvoice(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${id}-invoice.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      pushToast(texts.dashboard.downloadSuccess(id), 'success');
    } catch {
      pushToast(texts.dashboard.downloadError(id), 'error');
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [pushToast]);

  return { downloadingIds, onDownload };
}
