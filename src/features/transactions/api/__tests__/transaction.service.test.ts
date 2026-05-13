import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { TransactionService } from '../transaction.service';

describe('TransactionService deterministic behavior', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns stable retry status for same transaction id', async () => {
    const p1 = TransactionService.retryPayment('TRX-10452');
    const p2 = TransactionService.retryPayment('TRX-10452');
    await vi.runAllTimersAsync();
    const [a, b] = await Promise.all([p1, p2]);
    expect(a).toBe(b);
  });

  it('aborts retry request when signal is aborted', async () => {
    const controller = new AbortController();
    const promise = TransactionService.retryPayment('TRX-10452', controller.signal);
    controller.abort();
    await expect(promise).rejects.toThrow('Aborted');
  });
});
