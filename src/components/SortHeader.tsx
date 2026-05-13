'use client';

import styles from './SortHeader.module.css';

type SortableHeaderProps = {
  label: string;
  active: boolean;
  direction?: "asc" | "desc";
  onClick: () => void;
  className?: string;
  align?: 'left' | 'center' | 'right';
};

export function SortableHeader({
  label,
  active,
  direction,
  onClick,
  className,
  align = 'center',
}: SortableHeaderProps) {
  const justifyContent =
    align === 'right' ? 'flex-end' :
    align === 'left'  ? 'flex-start' : 'center';

  return (
    <th className={className}>
      <button
        onClick={onClick}
        className={`${styles.sortButton} ${active ? styles.active : ''}`}
        style={{ justifyContent }}
      >
        {label}
        {active && (
          <span className={styles.sortIcon}>
            {direction === "asc" ? "↑" : "↓"}
          </span>
        )}
      </button>
    </th>
  );
}
