'use client';

import styles from './ToastContainer.module.css';

const TYPE_CLASS: Record<string, string> = {
  success: styles.toastSuccess,
  error: styles.toastError,
  info: styles.toastInfo,
};

export function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: { id: string; message: string; type?: string }[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className={styles.container}>
      {toasts.map((t) => (
        <div key={t.id} className={`${styles.toast} ${TYPE_CLASS[t.type ?? 'info'] ?? ''}`} role="status">
          <span className={styles.toastMessage}>{t.message}</span>
          <button
            className={styles.closeBtn}
            onClick={() => onRemove(t.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
