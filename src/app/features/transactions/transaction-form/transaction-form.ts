import { Component, computed, inject, OnDestroy, OnInit, output, signal } from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { TransactionRequest } from '../../../core/models/request/transaction-request.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction';
import { AccountService } from '../../../core/services/account';
import { ModalService } from '../../../core/services/modal';
import { AccountResponse } from '../../../core/models/response/account-response.model';
import { TransactionType } from '../../../core/models/enums/transaction-type.enum';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format-pipe';

@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule, CurrencyFormatPipe],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css',
})
export class TransactionForm implements OnInit, OnDestroy {

  private readonly fb = inject(FormBuilder);
  private readonly transactionService = inject(TransactionService);
  private readonly accountService = inject(AccountService);
  private readonly modal = inject(ModalService);
  private readonly destroy$ = new Subject<void>();

  closed = output<boolean>();

  readonly submitting = signal(false);
  readonly loadingAccounts = signal(false);
  readonly accounts = signal<AccountResponse[]>([]);
  readonly selectedAccountNumber = signal<string>('');

  readonly transactionTypes = Object.values(TransactionType);

  readonly form = this.fb.group({
    accountNumber: ['', Validators.required],
    transactionType: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]]
  });

  readonly selectedAccount = computed(() => {
    const accNum = this.selectedAccountNumber();
    return this.accounts().find(a => a.accountNumber === accNum) ?? null;
  });

  ngOnInit(): void {
    this.loadAccounts();

    this.form.get('accountNumber')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => this.selectedAccountNumber.set(value ?? ''));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAccounts(): void {
    this.loadingAccounts.set(true);
    this.accountService
      .findAll({}, 0, 1000)
      .pipe(
        finalize(() => this.loadingAccounts.set(false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (page) => {
          this.accounts.set(page.content.filter(a => a.status));
        }
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const payload = this.form.getRawValue() as TransactionRequest;

    this.transactionService
      .create(payload)
      .pipe(
        finalize(() => this.submitting.set(false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.modal.success('Transaction completed successfully');
          this.closed.emit(true);
        }
      });
  }

  onCancel(): void {
    this.closed.emit(false);
  }

  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.touched && control.errors?.[error]);
  }

}
