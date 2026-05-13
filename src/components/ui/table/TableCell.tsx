import styles from './TableCell.module.css';

type Props = { children: React.ReactNode; className?: string };

export function TableCell({ children, className }: Props) {
  return <td className={`${styles.cell} ${className ?? ''}`.trim()}>{children}</td>;
}