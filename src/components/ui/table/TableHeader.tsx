import styles from './TableHeader.module.css';

type Props = {
  children: React.ReactNode;
};

export function TableHeader({ children }: Props) {
  return <thead className={styles.thead}>{children}</thead>;
}
