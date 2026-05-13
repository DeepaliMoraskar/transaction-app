// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useBatchRetry } from '../useBatchRetry';

const retryPaymentMock = vi.fn();

vi.mock('../../api/transaction.service', () => ({
  TransactionService: {
    retryPayment: (...args: unknown[]) => retryPaymentMock(...args)
  }
}));

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('useBatchRetry race conditions', () => {
  beforeEach(() => retryPaymentMock.mockReset());

  it('prevents stale overwrite when out-of-order duplicate retry resolves', async () => {
    const first = deferred<'success' | 'failed'>();
    const second = deferred<'success' | 'failed'>();
    retryPaymentMock.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);

    const updates: Array<{ id: string; status: string }> = [];
    const { result } = renderHook(() => useBatchRetry((id, status) => updates.push({ id, status })));

    const batch1 = act(async () => { await result.current.retryBatch(['TRX-1']); });
    const batch2 = act(async () => { await result.current.retryBatch(['TRX-1']); });

    second.resolve('failed');
    await batch2;
    first.resolve('success');
    await batch1;

    const terminal = updates.filter((u) => u.id === 'TRX-1' && (u.status === 'success' || u.status === 'failed'));
    expect(terminal[terminal.length - 1]?.status).toBe('failed');
  });

  it('handles cancelAll without allowing later success overwrite', async () => {
    retryPaymentMock.mockImplementation((_: string, signal?: AbortSignal) =>
      new Promise<'success'>((resolve, reject) => {
        signal?.addEventListener('abort', () => reject(new Error('Aborted')));
        setTimeout(() => resolve('success'), 10);
      })
    );

    const updates: string[] = [];
    const { result } = renderHook(() => useBatchRetry((_, status) => updates.push(status)));

    const running = act(async () => { await result.current.retryBatch(['TRX-2']); });
    act(() => result.current.cancelAll());
    await running;

    expect(updates.includes('failed')).toBe(true);
    expect(updates[updates.length - 1]).not.toBe('success');
  });
});
