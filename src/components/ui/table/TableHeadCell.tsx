import styles from './TableHeadCell.module.css';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function TableHeadCell({ children, className }: Props) {
  return (
    <th className={`${styles.th} ${className ?? ''}`.trim()}>
      {children}
    </th>
  );
}
