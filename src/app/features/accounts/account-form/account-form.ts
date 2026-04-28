import { Component, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../core/services/account';
import { ClientService } from '../../../core/services/client';
import { ModalService } from '../../../core/services/modal';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AccountResponse } from '../../../core/models/response/account-response.model';
import { ClientResponse } from '../../../core/models/response/client-response.model';
import { AccountType } from '../../../core/models/enums/account-type.enum';
import { AccountRequest } from '../../../core/models/request/account-request.model';

@Component({
  selector: 'app-account-form',
  imports: [ReactiveFormsModule],
  templateUrl: './account-form.html',
  styleUrl: './account-form.css',
})
export class AccountForm implements OnInit, OnDestroy {

  private readonly fb = inject(FormBuilder);
  private readonly accountService = inject(AccountService);
  private readonly clientService = inject(ClientService);
  private readonly modal = inject(ModalService);
  private readonly destroy$ = new Subject<void>();

  account = input<AccountResponse | null>(null);
  closed = output<boolean>();

  readonly submitting = signal(false);
  readonly loadingClients = signal(false);
  readonly clients = signal<ClientResponse[]>([]);
  readonly accountTypes = Object.values(AccountType);

  readonly form = this.fb.group({
    accountNumber: ['', [Validators.required, Validators.maxLength(30)]],
    typeAccount: ['', Validators.required],
    originalBalance: [0, [Validators.required, Validators.min(0)]],
    status: [true, Validators.required],
    clientId: [null as string | null, Validators.required]
  });

  ngOnInit(): void {
    this.loadClients();

    if (this.account()) {
      const account = this.account()!;
      this.form.patchValue({
        accountNumber: account.accountNumber,
        typeAccount: account.typeAccount,
        originalBalance: account.originalBalance,
        status: account.status,
        clientId: account.clientId
      });
      this.form.get('originalBalance')?.disable();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isEdit(): boolean {
    return this.account() !== null;
  }

  private loadClients(): void {
    this.loadingClients.set(true);
    this.clientService
      .findAll('', 0, 1000)
      .pipe(
        finalize(() => this.loadingClients.set(false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (page) => {
          const all = page.content;
          if (this.isEdit()) {
            this.clients.set(all);
          } else {
            this.clients.set(all.filter(c => c.status));
          }
        }
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const payload = this.form.getRawValue() as unknown as AccountRequest;

    const request$ = this.isEdit()
      ? this.accountService.update(this.account()!.accountId, payload)
      : this.accountService.create(payload);

    request$
      .pipe(
        finalize(() => this.submitting.set(false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.modal.success(
            this.isEdit() ? 'Account updated successfully' : 'Account created successfully'
          );
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
