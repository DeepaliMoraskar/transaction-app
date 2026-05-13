import styles from './TableBody.module.css';

type Props = {
  children: React.ReactNode;
};

export function TableBody({ children }: Props) {
  return <tbody className={styles.tbody}>{children}</tbody>;
}
