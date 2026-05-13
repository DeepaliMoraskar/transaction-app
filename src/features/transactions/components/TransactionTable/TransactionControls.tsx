import type { ChangeEvent } from 'react';
import { STATUS_FILTERS } from '../../constants';
import { texts } from '../../constants/texts';
import type { StatusFilter } from '../../types';
import styles from './TransactionControls.module.css';

type Props = {
  search: string;
  statusFilter: StatusFilter;
  globalBusy: boolean;
  hasSelection: boolean;
  selectedCount: number;
  formattedSelectedAmount: string;
  visibleFailedCount: number;

  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (value: StatusFilter) => void;
  onRetrySelected: () => void;
  onSelectAllFailed: () => void;
};

export function TransactionControls({
  search,
  statusFilter,
  globalBusy,
  hasSelection,
  selectedCount,
  formattedSelectedAmount,
  visibleFailedCount,
  onSearchChange,
  onStatusChange,
  onRetrySelected,
  onSelectAllFailed,
}: Props) {
  return (
    <div className={styles.controls}>
      {/* Row 1: filters + search */}
      <div className={styles.filterRow}>
        <div className={styles.pills}>
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              className={`${styles.pill} ${statusFilter === status ? styles.pillActive : ''}`}
              onClick={() => onStatusChange(status)}
            >
              {texts.controls.statusLabels[status]}
            </button>
          ))}
        </div>

        <label className={styles.searchWrap}>
          <span className="sr-only">{texts.controls.searchLabel}</span>
          <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            aria-label={texts.controls.searchLabel}
            value={search}
            onChange={onSearchChange}
            placeholder={texts.controls.searchPlaceholder}
            className={styles.searchInput}
          />
        </label>
      </div>

      {/* Row 2: selection actions */}
      <div className={styles.actionRow}>
        <div className={styles.selectionInfo}>
          {visibleFailedCount > 0 && (
            <button
              className={styles.selectAllBtn}
              onClick={onSelectAllFailed}
              disabled={globalBusy}
            >
              {texts.controls.selectAllFailed(visibleFailedCount)}
            </button>
          )}
          {hasSelection && (
            <span className={styles.selectionBadge}>
              {selectedCount} selected · {formattedSelectedAmount}
            </span>
          )}
        </div>

        <button
          className={styles.btnRetry}
          disabled={!hasSelection || globalBusy}
          onClick={onRetrySelected}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={styles.retryIcon}>
            <path d="M13.5 2.5A7 7 0 1 0 15 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M15 2.5V6H11.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {hasSelection
            ? texts.controls.reprocessSelected(selectedCount)
            : texts.controls.reprocessLabel}
        </button>
      </div>
    </div>
  );
}
