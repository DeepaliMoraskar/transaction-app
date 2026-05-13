import { z } from 'zod';
import type { Transaction, TransactionStatus } from '../types';

const transactionSchema = z.object({
  id: z.string(),
  amount: z.number(),
  currency: z.literal('USD'),
  timestamp: z.string(),
  status: z.enum(['success', 'failed', 'processing'])
});

const transactionListSchema = z.array(transactionSchema);

const rawSeed = [
  { id: 'TRX-10451', amount: 13.99, currency: 'USD', timestamp: '2026-05-03T10:12:00Z', status: 'success' },
  { id: 'TRX-10452', amount: 19.99, currency: 'USD', timestamp: '2026-05-01T06:45:00Z', status: 'failed' },
  { id: 'TRX-10453', amount: 9.99, currency: 'USD', timestamp: '2026-04-29T18:31:00Z', status: 'success' },
  { id: 'TRX-10454', amount: 19.99, currency: 'USD', timestamp: '2026-04-26T12:03:00Z', status: 'failed' },
  { id: 'TRX-10456', amount: 13.99, currency: 'USD', timestamp: '2026-04-19T19:53:00Z', status: 'failed' },
  { id: 'TRX-10457', amount: 13.99, currency: 'USD', timestamp: '2026-05-03T10:12:00Z', status: 'success' },
  { id: 'TRX-10458', amount: 19.99, currency: 'USD', timestamp: '2026-05-01T06:45:00Z', status: 'failed' },
  { id: 'TRX-10459', amount: 9.99, currency: 'USD', timestamp: '2026-04-29T18:31:00Z', status: 'success' },
  { id: 'TRX-10460', amount: 19.99, currency: 'USD', timestamp: '2026-04-26T12:03:00Z', status: 'failed' },
  { id: 'TRX-10462', amount: 13.99, currency: 'USD', timestamp: '2026-04-19T19:53:00Z', status: 'failed' },
  { id: 'TRX-10463', amount: 13.99, currency: 'USD', timestamp: '2026-05-03T10:12:00Z', status: 'success' },
  { id: 'TRX-10464', amount: 19.99, currency: 'USD', timestamp: '2026-05-01T06:45:00Z', status: 'failed' },
  { id: 'TRX-10465', amount: 9.99, currency: 'USD', timestamp: '2026-04-29T18:31:00Z', status: 'success' },
  { id: 'TRX-10466', amount: 19.99, currency: 'USD', timestamp: '2026-04-26T12:03:00Z', status: 'failed' },
  { id: 'TRX-10468', amount: 13.99, currency: 'USD', timestamp: '2026-04-19T19:53:00Z', status: 'failed' },
  { id: 'TRX-10469', amount: 13.99, currency: 'USD', timestamp: '2026-05-03T10:12:00Z', status: 'success' },
  { id: 'TRX-10470', amount: 19.99, currency: 'USD', timestamp: '2026-05-01T06:45:00Z', status: 'failed' },
  { id: 'TRX-10471', amount: 9.99, currency: 'USD', timestamp: '2026-04-29T18:31:00Z', status: 'success' },
  { id: 'TRX-10472', amount: 19.99, currency: 'USD', timestamp: '2026-04-26T12:03:00Z', status: 'failed' },
  { id: 'TRX-10474', amount: 13.99, currency: 'USD', timestamp: '2026-04-19T19:53:00Z', status: 'failed' },
  { id: 'TRX-10475', amount: 13.99, currency: 'USD', timestamp: '2026-05-03T10:12:00Z', status: 'success' },
  { id: 'TRX-10476', amount: 19.99, currency: 'USD', timestamp: '2026-05-01T06:45:00Z', status: 'failed' },
  { id: 'TRX-10477', amount: 9.99, currency: 'USD', timestamp: '2026-04-29T18:31:00Z', status: 'success' },
  { id: 'TRX-10478', amount: 19.99, currency: 'USD', timestamp: '2026-04-26T12:03:00Z', status: 'failed' },
  { id: 'TRX-10480', amount: 13.99, currency: 'USD', timestamp: '2026-04-19T19:53:00Z', status: 'failed' },
] as const;


const seedTransactions = transactionListSchema.parse(rawSeed);

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new Error('Aborted'));
    });
  });

export const TransactionService = {
  fetchTransactions: async (signal?: AbortSignal): Promise<Transaction[]> => {
    await wait(800, signal);
    return seedTransactions;
  },

  // In production this call should include an idempotency key (e.g. transaction ID).
  retryPayment: async (id: string, signal?: AbortSignal): Promise<TransactionStatus> => {
    const delay = Math.floor(Math.random() * 3000) + 1000;
    await wait(delay, signal);
    // Deterministic by ID so the same transaction always retries to the same outcome
    const hash = [...id].reduce((h, c) => Math.imul(31, h) + c.charCodeAt(0) | 0, 0);
    return Math.abs(hash) % 10 < 8 ? 'success' : 'failed';
  },

  generateInvoice: async (id: string, signal?: AbortSignal): Promise<Blob> => {
    await wait(2000, signal);
    // const doc = new jsPDF();
    // doc.text(`Invoice for ${id}`, 10, 10);
    // doc.text(`Generated: ${new Date().toISOString()}`, 10, 20);
    // return doc.output('blob');
    if (Math.random() < 0.1) throw new Error('Invoice generation failed');
    return new Blob([`Invoice for ${id}\nGenerated: ${new Date().toISOString()}`], { type: 'application/pdf' });
  }
};
