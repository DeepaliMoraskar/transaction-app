# Transactions Management Dashboard

## Architecture choices (senior-focused)

- Feature/domain structure under `src/features/transactions`.
- Server -> Client boundary:
  - Server Component (`app/page.tsx`) performs initial fetch
  - Client Feature Module (`TransactionTable`) handles interactive dashboard behavior
- Service-Component split:
  - Infrastructure: `api/transaction.service.ts`
  - Application: `hooks/useTransactions.ts`, `hooks/useBatchRetry.ts`
  - Presentation: `components/TransactionTable/*`
- Runtime response validation with Zod at service boundary.
- Normalized transaction state (`Record<string, Transaction>`) for O(1) updates.
- Command-style batch retry hook with request-version guards for out-of-order resolution safety.
- Abort-safe async flow via `AbortController`.
- Typed row-state transitions with discriminated unions.

## Practical tradeoff notes

- TanStack Query is used only for server-state bootstrapping (`fetchTransactions`).
- UI orchestration (selection, row states, batch commands) stays local in hooks for clarity.

## Run

```bash
npm install
npm run dev
```


## Codebase note

- The active implementation lives only in `src/features/transactions/*` to avoid duplicate hooks/components and split ownership.


## Additional senior enhancements

- `useOptimistic` is applied in `useTransactions` to immediately reflect retrying row state.
- Large-list rendering uses `@tanstack/react-virtual` in `TransactionTable`.
- Concurrency utility has automated test coverage (`vitest`) for worker pool limiting.
