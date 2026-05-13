import styles from './TableRow.module.css';

type Variant = 'default' | 'selected' | 'processing';

type Props = { children: React.ReactNode; variant?: Variant };

export function TableRow({ children, variant = 'default' }: Props) {
  const variantClass =
    variant === 'selected' ? styles.rowSelected :
    variant === 'processing' ? styles.rowProcessing : '';
  return <tr className={`${styles.row} ${variantClass}`}>{children}</tr>;
}