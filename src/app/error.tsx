'use client';

import { texts } from '@/features/transactions/constants/texts';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="container" role="alert" aria-live="assertive">
      <h2>{texts.errors.dashboardError}</h2>
      {error.message && (
        <p style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)', marginBottom: '1rem' }}>
          {error.message}
        </p>
      )}
      <button onClick={reset}>{texts.errors.tryAgain}</button>
    </main>
  );
}
