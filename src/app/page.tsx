import { Suspense } from 'react';
import { TransactionService } from '@/features/transactions/api/transaction.service';
import { TransactionTableSkeleton } from '@/components/Skeleton';
import { Dashboard } from '@/features/transactions/components/Dashboard';

export default function Home() {
  return (
    <main className="container">
      <Suspense fallback={<TransactionTableSkeleton />}>
        <TransactionDataLayer />
      </Suspense>
    </main>
  );
}

async function TransactionDataLayer() {
  const initialTransactions = await TransactionService.fetchTransactions();
  return <Dashboard initialTransactions={initialTransactions} />;
}
