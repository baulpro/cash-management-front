import { Component, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../../core/services/client';
import { ModalService } from '../../../core/services/modal';
import { ClientResponse } from '../../../core/models/response/client-response.model';
import { ClientRequest } from '../../../core/models/request/client-request.model';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule],
  templateUrl: './client-form.html',
  styleUrl: './client-form.css',
})
export class ClientForm implements OnInit, OnDestroy {

  private readonly fb = inject(FormBuilder);
  private readonly clientService = inject(ClientService);
  private readonly modal = inject(ModalService)
  private readonly destroy$ = new Subject<void>();

  client = input<ClientResponse | null>(null);
  closed = output<boolean>();

  readonly submitting = signal(false);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    gender: ['', [Validators.required]],
    age: [null as number | null, [Validators.required, Validators.min(0), Validators.max(120)]],
    address: [''],
    phone: ['', Validators.maxLength(20)],
    idCard: ['', [Validators.required, Validators.maxLength(20)]],
    password: [''],
    status: [true, Validators.required]
  });


  ngOnInit(): void {
    const passwordControl = this.form.get('password');
    if (!this.isEdit()) {
      passwordControl?.setValidators([Validators.required, Validators.minLength(4)]);
    }

    if (this.client()) {
      const client = this.client()!;
      this.form.patchValue({
        name: client.name,
        gender: client.gender,
        age: client.age,
        address: client.address,
        phone: client.phone,
        idCard: client.idCard,
        password: '',
        status: client.status
      });
    }

    passwordControl?.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isEdit(): boolean {
    return this.client() !== null;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const payload = this.form.getRawValue() as ClientRequest;

    const request$ = this.isEdit() ?
      this.clientService.update(this.client()!.clientId, payload)
      : this.clientService.create(payload);

    request$.pipe(
      finalize(() => this.submitting.set(false)),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.modal.success(
        this.isEdit() ? 'Client updated successfully' : 'Client created successfully'
      );
      this.closed.emit(true);
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
