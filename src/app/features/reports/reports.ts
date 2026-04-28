import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReportService } from '../../core/services/report';
import { ModalService } from '../../core/services/modal';
import { finalize, Subject, takeUntil } from 'rxjs';
import { dateRangeValidator } from '../../shared/validators/date-range.validator';
import { ReportRequest } from '../../core/models/request/report-request.model';
import { HttpResponse } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reports',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports implements OnDestroy {

  private readonly fb = inject(FormBuilder);
  private readonly reportService = inject(ReportService);
  private readonly modal = inject(ModalService);
  private readonly destroy$ = new Subject<void>();

  readonly faFile = faFile;
  readonly generating = signal(false);

  readonly form = this.fb.group(
    {
      clientName: ['', [Validators.required, Validators.minLength(2)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    },
    { validators: dateRangeValidator('startDate', 'endDate') }
  );

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onGenerate(): void {
    if (this.form.errors?.['dateRangeInvalid']) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.generating.set(true);
    const payload = this.form.getRawValue() as ReportRequest;
    const processedPayload = {
      ...payload,
      clientName: payload.clientName.trim(),
    };

    this.reportService
      .generateTransactionReport(processedPayload)
      .pipe(
        finalize(() => this.generating.set(false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => this.handleSuccess(response, payload)
      });
  }

  private handleSuccess(response: HttpResponse<Blob>, payload: ReportRequest): void {
    const blob = response.body;
    if (!blob || blob.size === 0) {
      this.modal.error('The report could not be generated');
      return;
    }

    const fileName =
      this.extractFileName(response.headers.get('Content-Disposition'))
      ?? this.buildDefaultFileName(payload);

    this.downloadBlob(blob, fileName);
    this.modal.success('Report generated and downloaded successfully');
  }

  private extractFileName(disposition: string | null): string | null {
    if (!disposition) return null;
    const match = /filename="?([^";]+)"?/i.exec(disposition);
    return match ? match[1].trim() : null;
  }

  private buildDefaultFileName(payload: ReportRequest): string {
    const safeName = payload.clientName.replace(/\s+/g, '_');
    return `transaction_report_${safeName}_${payload.startDate}_${payload.endDate}.pdf`;
  }

  private downloadBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.touched && control.errors?.[error]);
  }

}
