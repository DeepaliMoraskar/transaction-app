import styles from './Skeleton.module.css';

export function TransactionTableSkeleton() {
  return (
    <div className={styles.wrapper} aria-busy="true" aria-live="polite" aria-label="Loading transactions">
      <div className={styles.header}>
        {['8%', '22%', '14%', '22%', '16%', '18%'].map((w, i) => (
          <div key={i} className={styles.headerCell} style={{ width: w }}>
            <div className={styles.shimmer} style={{ width: '60%', height: 14, borderRadius: 4 }} />
          </div>
        ))}
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={styles.row}>
          <div className={styles.cell} style={{ width: '8%' }}>
            <div className={`${styles.shimmer} ${styles.circle}`} />
          </div>
          <div className={styles.cell} style={{ width: '22%' }}>
            <div className={styles.shimmer} style={{ width: '80%', height: 13 }} />
          </div>
          <div className={styles.cell} style={{ width: '14%' }}>
            <div className={styles.shimmer} style={{ width: '65%', height: 13, marginLeft: 'auto' }} />
          </div>
          <div className={styles.cell} style={{ width: '22%' }}>
            <div className={styles.shimmer} style={{ width: '75%', height: 13 }} />
          </div>
          <div className={styles.cell} style={{ width: '16%' }}>
            <div className={styles.shimmer} style={{ width: 64, height: 24, borderRadius: 6 }} />
          </div>
          <div className={styles.cell} style={{ width: '18%' }}>
            <div className={styles.shimmer} style={{ width: 72, height: 28, borderRadius: 6 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
