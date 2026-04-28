import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction';
import { ModalService } from '../../../core/services/modal';
import { debounceTime, distinctUntilChanged, finalize, Subject, takeUntil } from 'rxjs';
import { TransactionResponse } from '../../../core/models/response/transaction-response.model';
import { TransactionFilters } from '../../../core/models/bo/transaction.model';
import { environment } from '../../../../environments/environment';
import { dateRangeValidator } from '../../../shared/validators/date-range.validator';
import { DatePipe } from '@angular/common';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format-pipe';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { TransactionForm } from '../transaction-form/transaction-form';

@Component({
  selector: 'app-transaction-list',
  imports: [ReactiveFormsModule, DatePipe, CurrencyFormatPipe, Pagination, TransactionForm],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
})
export class TransactionList implements OnInit, OnDestroy {

  private readonly fb = inject(FormBuilder);
  private readonly transactionService = inject(TransactionService);
  private readonly modal = inject(ModalService);
  private readonly destroy$ = new Subject<void>();

  readonly transactions = signal<TransactionResponse[]>([]);
  readonly currentPage = signal(0);
  readonly totalPages = signal(0);
  readonly totalElements = signal(0);
  readonly loading = signal(false);
  readonly showForm = signal(false);

  readonly filterForm = this.fb.group(
    {
      accountNumber: [''],
      clientName: [''],
      startDate: [''],
      endDate: ['']
    },
    { validators: dateRangeValidator('startDate', 'endDate') }
  );

  ngOnInit(): void {
    this.loadTransactions();

    this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (this.filterForm.errors?.['dateRangeInvalid']) {
          return;
        }
        this.currentPage.set(0);
        this.loadTransactions();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTransactions(): void {
    this.loading.set(true);
    const filters = this.filterForm.value as TransactionFilters;
    this.transactionService
      .findAll(filters, this.currentPage(), environment.pageSize)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (page) => {
          this.transactions.set(page.content);
          this.totalPages.set(page.totalPages);
          this.totalElements.set(page.totalElements);
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadTransactions();
  }

  openCreate(): void {
    this.showForm.set(true);
  }

  onFormClose(refresh: boolean): void {
    this.showForm.set(false);
    if (refresh) this.loadTransactions();
  }

  onDelete(transaction: TransactionResponse): void {
    this.modal.confirm(
      `Are you sure you want to delete this transaction? ` +
      `The account balance will be adjusted accordingly.`,
      () => this.deleteTransaction(transaction)
    );
  }

  clearFilters(): void {
    this.filterForm.reset({
      accountNumber: '',
      clientName: '',
      startDate: '',
      endDate: ''
    });
  }

  formatAmount(t: TransactionResponse): string {
    const abs = Math.abs(t.amount);
    const sign = t.transactionType === 'DEBIT' ? '-' : '+';
    return `${sign} $ ${abs.toFixed(2)}`;
  }

  private deleteTransaction(transaction: TransactionResponse): void {
    this.transactionService
      .delete(transaction.transactionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.modal.success('Transaction deleted successfully');
        if (this.transactions().length === 1 && this.currentPage() > 0) {
          this.currentPage.set(this.currentPage() - 1);
        }
        this.loadTransactions();
      });
  }

}
