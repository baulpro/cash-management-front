import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../../core/services/account';
import { ModalService } from '../../../core/services/modal';
import { AccountResponse } from '../../../core/models/response/account-response.model';
import { AccountType } from '../../../core/models/enums/account-type.enum';
import { debounceTime, distinctUntilChanged, finalize, Subject, takeUntil } from 'rxjs';
import { AccountFilters } from '../../../core/models/bo/account.model';
import { environment } from '../../../../environments/environment';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format-pipe';
import { StatusLabelPipe } from '../../../shared/pipes/status-label-pipe';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { AccountForm } from '../account-form/account-form';

@Component({
  selector: 'app-account-list',
  imports: [ReactiveFormsModule, CurrencyFormatPipe, StatusLabelPipe, Pagination, AccountForm],
  templateUrl: './account-list.html',
  styleUrl: './account-list.css',
})
export class AccountList {

  private readonly fb = inject(FormBuilder);
  private readonly accountService = inject(AccountService);
  private readonly modal = inject(ModalService);
  private readonly destroy$ = new Subject<void>();

  readonly accounts = signal<AccountResponse[]>([]);
  readonly currentPage = signal(0);
  readonly totalPages = signal(0);
  readonly totalElements = signal(0);
  readonly loading = signal(false);
  readonly showForm = signal(false);
  readonly selectedAccount = signal<AccountResponse | null>(null);

  readonly accountTypes = Object.values(AccountType);

  readonly filterForm = this.fb.group({
    accountNumber: [''],
    typeAccount: [''],
    clientName: ['']
  });

  ngOnInit(): void {
    this.loadAccounts();

    this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage.set(0);
        this.loadAccounts();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAccounts(): void {
    this.loading.set(true);
    const filters = this.filterForm.value as AccountFilters;
    this.accountService
      .findAll(filters, this.currentPage(), environment.pageSize)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (page) => {
          this.accounts.set(page.content);
          this.totalPages.set(page.totalPages);
          this.totalElements.set(page.totalElements);
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadAccounts();
  }

  openCreate(): void {
    this.selectedAccount.set(null);
    this.showForm.set(true);
  }

  openEdit(account: AccountResponse): void {
    this.selectedAccount.set(account);
    this.showForm.set(true);
  }

  onFormClose(refresh: boolean): void {
    this.showForm.set(false);
    this.selectedAccount.set(null);
    if (refresh) this.loadAccounts();
  }

  onDelete(account: AccountResponse): void {
    this.modal.confirm(
      `Are you sure you want to delete account "${account.accountNumber}"?`,
      () => this.deleteAccount(account)
    );
  }

  clearFilters(): void {
    this.filterForm.reset({ accountNumber: '', typeAccount: '', clientName: '' });
  }

  private deleteAccount(account: AccountResponse): void {
    this.accountService
      .delete(account.accountId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.modal.success('Account deleted successfully');
        if (this.accounts().length === 1 && this.currentPage() > 0) {
          this.currentPage.set(this.currentPage() - 1);
        }
        this.loadAccounts();
      });
  }

}
