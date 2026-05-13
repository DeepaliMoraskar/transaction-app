"use client";

import type { RefObject } from "react";
import type { Virtualizer } from "@tanstack/react-virtual";

import { Table } from "@/components/ui/table/Table";
import { TableHeader } from "@/components/ui/table/TableHeader";
import { TableHeadCell } from "@/components/ui/table/TableHeadCell";
import { TableBody } from "@/components/ui/table/TableBody";
import { TransactionRow } from "./TransactionRow";
import { SortableHeader } from "@/components/SortHeader";

import { texts } from "../../constants/texts";
import type { SortBy, Transaction } from "../../types";
import styles from "./TransactionTable.module.css";

type Props = {
  rows: Transaction[];
  sortBy: SortBy;

  parentRef: RefObject<HTMLDivElement>;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;

  selectedSet: Set<string>;
  processingIds: ReadonlySet<string>;
  downloadingIds: Set<string>;

  globalBusy: boolean;
  allFailedSelected: boolean;
  someFailedSelected: boolean;

  amountSortActive: boolean;
  amountSortDirection: 'asc' | 'desc';
  dateSortActive: boolean;
  dateSortDirection: 'asc' | 'desc';

  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onDownload: (id: string) => void;
  onRetry: (id: string) => void;
  onAmountHeaderClick: () => void;
  onDateHeaderClick: () => void;
};

export function TransactionsTable({
  rows,
  parentRef,
  rowVirtualizer,
  selectedSet,
  processingIds,
  downloadingIds,
  globalBusy,
  allFailedSelected,
  someFailedSelected,
  amountSortActive,
  amountSortDirection,
  dateSortActive,
  dateSortDirection,
  onSelect,
  onSelectAll,
  onDownload,
  onRetry,
  onAmountHeaderClick,
  onDateHeaderClick,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.tableContainer}>
        <Table>
          <colgroup>
            <col className={styles.colCheck} />
            <col className={styles.colId} />
            <col className={styles.colAmount} />
            <col className={styles.colDate} />
            <col className={styles.colStatus} />
            <col className={styles.colInvoice} />
          </colgroup>
          <TableHeader>
            <tr>
              <TableHeadCell className={styles.thCheck}>
                <input
                  type="checkbox"
                  className={styles.selectAllCheckbox}
                  checked={allFailedSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someFailedSelected && !allFailedSelected;
                  }}
                  onChange={onSelectAll}
                  disabled={globalBusy}
                  aria-label={texts.table.selectAllAriaLabel}
                  title={texts.table.selectAllTitle}
                />
              </TableHeadCell>

              <TableHeadCell className={styles.thId}>{texts.table.colId}</TableHeadCell>

              <SortableHeader
                label={texts.table.colAmount}
                active={amountSortActive}
                direction={amountSortDirection}
                onClick={onAmountHeaderClick}
                className={styles.thAmount}
                align="left"
              />

              <SortableHeader
                label={texts.table.colDate}
                active={dateSortActive}
                direction={dateSortDirection}
                onClick={onDateHeaderClick}
                className={styles.thDate}
                align="left"
              />

              <TableHeadCell className={styles.thStatus}>{texts.table.colStatus}</TableHeadCell>
              <TableHeadCell className={styles.thInvoice}>{texts.table.colInvoice}</TableHeadCell>
            </tr>
          </TableHeader>
        </Table>
      </div>

      <div
        ref={parentRef}
        className={styles.scrollArea}
        aria-busy={globalBusy}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {rows.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className={styles.emptyIcon} aria-hidden="true">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 11h6M11 8v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className={styles.emptyTitle}>{texts.table.emptyTitle}</p>
              <p className={styles.emptyHint}>{texts.table.emptyHint}</p>
            </div>
          ) : (
            rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const tx = rows[virtualRow.index];
              return (
                <div
                  key={tx.id}
                  className={styles.virtualRow}
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                >
                  <table className={styles.virtualTable}>
                    <colgroup>
                      <col className={styles.colCheck} />
                      <col className={styles.colId} />
                      <col className={styles.colAmount} />
                      <col className={styles.colDate} />
                      <col className={styles.colStatus} />
                      <col className={styles.colInvoice} />
                    </colgroup>
                    <tbody>
                      <TransactionRow
                        tx={tx}
                        selected={selectedSet.has(tx.id)}
                        disabled={globalBusy}
                        downloadingIds={downloadingIds}
                        processingIds={processingIds}
                        onSelect={onSelect}
                        onDownload={onDownload}
                        onRetry={onRetry}
                      />
                    </tbody>
                  </table>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
