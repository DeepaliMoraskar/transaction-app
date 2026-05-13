"use client";

import { useDashboardViewModel } from '../viewModels/useDashboardViewModel';
import { TransactionControls } from "./TransactionTable/TransactionControls";
import { TransactionsTable } from "./TransactionTable/TransactionTable";
import { ToastContainer } from "@/components/ToastContainer";
import { texts } from '../constants/texts';
import type { Transaction } from "../types";
import styles from "./Dashboard.module.css";

type Props = {
  initialTransactions: Transaction[];
};

export function Dashboard({ initialTransactions }: Props) {
  const vm = useDashboardViewModel(initialTransactions);

  if (vm.isLoading) {
    return <div>{texts.dashboard.loading}</div>;
  }

  return (
    <section className={styles.root}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>{texts.dashboard.title}</h1>
          <p className={styles.pageSubtitle}>{texts.dashboard.subtitle}</p>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{vm.totalStats.total}</span>
            <span className={styles.statLabel}>{texts.dashboard.stats.total}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{vm.formattedTotalAmount}</span>
            <span className={styles.statLabel}>{texts.dashboard.stats.amount}</span>
          </div>
          <div className={`${styles.statCard} ${styles.statFailed}`}>
            <span className={styles.statValue}>{vm.totalStats.failed}</span>
            <span className={styles.statLabel}>{texts.dashboard.stats.failed}</span>
          </div>
          <div className={`${styles.statCard} ${styles.statSuccess}`}>
            <span className={styles.statValue}>{vm.totalStats.success}</span>
            <span className={styles.statLabel}>{texts.dashboard.stats.success}</span>
          </div>
        </div>
      </div>

      {/* Retry Progress */}
      {vm.globalBusy && vm.retryTotal > 0 && (
        <div className={styles.progressBar} role="status" aria-live="polite">
          <div className={styles.progressFill} style={{ width: `${vm.retryProgress}%` }} />
          <span className={styles.progressText}>
            {texts.dashboard.progress(vm.processingIds.size, vm.retryTotal)}
          </span>
        </div>
      )}

      {/* Retry Summary */}
      {vm.summary && !vm.globalBusy && (
        <div className={styles.notice} role="status" aria-live="polite">
          {texts.dashboard.summary(vm.summary.total, vm.summary.success, vm.summary.failed)}
        </div>
      )}

      <ToastContainer toasts={vm.toasts} onRemove={vm.removeToast} />

      <TransactionControls
        search={vm.search}
        statusFilter={vm.statusFilter}
        globalBusy={vm.globalBusy}
        hasSelection={vm.selectedIds.length > 0}
        selectedCount={vm.selectedIds.length}
        formattedSelectedAmount={vm.formattedSelectedAmount}
        visibleFailedCount={vm.visibleFailedIds.length}
        onSearchChange={vm.onSearchChange}
        onStatusChange={vm.onStatusChange}
        onRetrySelected={vm.handleRetry}
        onSelectAllFailed={vm.onSelectAllFailed}
      />

      <div className={styles.tableArea}>
        <TransactionsTable
          rows={vm.visibleTransactions}
          sortBy={vm.sortBy}
          parentRef={vm.parentRef}
          rowVirtualizer={vm.rowVirtualizer}
          selectedSet={vm.selectedSet}
          processingIds={vm.processingIds}
          downloadingIds={vm.downloadingIds}
          globalBusy={vm.globalBusy}
          allFailedSelected={vm.allFailedSelected}
          someFailedSelected={vm.someFailedSelected}
          onSelect={vm.toggleSelection}
          onSelectAll={vm.onSelectAll}
          onDownload={vm.onDownload}
          onRetry={vm.handleSingleRetry}
          onAmountHeaderClick={vm.onAmountHeaderClick}
          onDateHeaderClick={vm.onDateHeaderClick}
          amountSortActive={vm.sortBy === 'amountAsc' || vm.sortBy === 'amountDesc'}
          amountSortDirection={vm.sortBy === 'amountDesc' ? 'desc' : 'asc'}
          dateSortActive={vm.sortBy === 'dateAsc' || vm.sortBy === 'dateDesc'}
          dateSortDirection={vm.sortBy === 'dateDesc' ? 'desc' : 'asc'}
        />
      </div>
    </section>
  );
}
