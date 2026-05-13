"use client";

import { memo } from "react";
import { TableRow } from "@/components/ui/table/TableRow";
import { TableCell } from "@/components/ui/table/TableCell";

import { useTransactionRowViewModel } from "../../viewModels/useTransactionRowViewModel";
import { currencyFormatter, dateFormatter } from "../../utils";
import { texts } from "../../constants/texts";
import type { Transaction } from "../../types";
import styles from "./TransactionRow.module.css";

type Props = {
  tx: Transaction;
  selected: boolean;
  disabled: boolean;
  downloadingIds: Set<string>;
  processingIds: ReadonlySet<string>;

  onSelect: (id: string) => void;
  onDownload: (id: string) => void;
  onRetry: (id: string) => void;
};

export const TransactionRow = memo(({
  tx,
  selected,
  disabled,
  downloadingIds,
  processingIds,
  onSelect,
  onDownload,
  onRetry,
}: Props) => {
  const row = useTransactionRowViewModel(
    tx,
    { selected, downloadingIds, processingIds },
    { onSelect, onDownload, onRetry },
  );

  return (
    <TableRow variant={row.rowVariant as 'default' | 'selected' | 'processing'}>
      {/* Checkbox / indicator */}
      <TableCell className={styles.checkboxCell}>
        {row.isRetrying ? (
          <span
            className={styles.spinnerInline}
            role="status"
            aria-label={texts.row.retryingAriaLabel(tx.id)}
          />
        ) : row.isFailed ? (
          <input
            type="checkbox"
            checked={selected}
            disabled={disabled}
            className={styles.checkbox}
            aria-label={texts.row.checkboxAriaLabel(tx.id)}
            onChange={row.onSelectChange}
          />
        ) : (
          <span className={styles.successIcon} aria-label={texts.row.successAriaLabel}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="8" fill="var(--color-success-light)" />
              <path d="M5 8l2.5 2.5L11 6" stroke="var(--color-success)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </TableCell>

      {/* ID */}
      <TableCell className={styles.idCell}>{tx.id}</TableCell>

      {/* Amount */}
      <TableCell className={styles.amountCell}>
        {currencyFormatter.format(tx.amount)}
      </TableCell>

      {/* Date */}
      <TableCell className={styles.dateCell}>
        <span title={new Date(tx.timestamp).toISOString()}>
          {dateFormatter.format(new Date(tx.timestamp))}
        </span>
      </TableCell>

      {/* Status */}
      <TableCell className={styles.statusCell}>
        <span className={`${styles.statusBadge} ${row.getStatusClass(styles)}`}>
          {row.isRetrying && <span className={styles.spinnerBadge} />}
          {row.statusLabel}
        </span>
      </TableCell>

      {/* Action */}
      <TableCell className={styles.downloadCell}>
        {row.isRetrying ? (
          <span className={styles.hint}>{texts.row.processingHint}</span>
        ) : row.isFailed ? (
          <button
            className={styles.buttonRetry}
            disabled={disabled}
            onClick={row.onRetryClick}
            title={texts.row.reprocessTitle(tx.id)}
          >
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M12 2A6 6 0 1 0 13.5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M13.5 2V5.5H10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {texts.row.reprocessLabel}
          </button>
        ) : row.isSuccess ? (
          <button
            className={styles.button}
            disabled={disabled || row.isDownloading}
            onClick={row.onDownloadClick}
            title={texts.row.downloadTitle(tx.id)}
          >
            {row.isDownloading ? (
              <>
                <span className={styles.spinner} />
                {texts.row.downloadGenerating}
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 1v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {texts.row.downloadLabel}
              </>
            )}
          </button>
        ) : null}
      </TableCell>
    </TableRow>
  );
});

TransactionRow.displayName = "TransactionRow";
