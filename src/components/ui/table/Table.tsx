import styles from './Table.module.css';

type Props = { children: React.ReactNode };

export function Table({ children }: Props) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>{children}</table>
    </div>
  );
}