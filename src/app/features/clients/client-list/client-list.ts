import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ClientService } from '../../../core/services/client';
import { ModalService } from '../../../core/services/modal';
import { ClientResponse } from '../../../core/models/response/client-response.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { debounceTime, distinctUntilChanged, finalize, Subject, takeUntil } from 'rxjs';
import { StatusLabelPipe } from '../../../shared/pipes/status-label-pipe';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { ClientForm } from '../client-form/client-form';

@Component({
  selector: 'app-client-list',
  imports: [ReactiveFormsModule, StatusLabelPipe, Pagination, ClientForm],
  templateUrl: './client-list.html',
  styleUrl: './client-list.css',
})
export class ClientList implements OnInit, OnDestroy {
  private readonly clientService = inject(ClientService);
  private readonly modal = inject(ModalService);
  private readonly destroy$ = new Subject<void>();

  readonly clients = signal<ClientResponse[]>([]);
  readonly currentPage = signal(0);
  readonly totalPages = signal(0);
  readonly totalElements = signal(0);
  readonly loading = signal(false);
  readonly showForm = signal(false);
  readonly selectedClient = signal<ClientResponse | null>(null);

  readonly searchControl = new FormControl('', { nonNullable: true });

  ngOnInit(): void {
    this.loadClients();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.currentPage.set(0);
        this.loadClients();
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadClients(): void {
    this.loading.set(true);
    this.clientService.findAll(this.searchControl.value, this.currentPage(), environment.pageSize)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (page) => {
          this.clients.set(page.content);
          this.totalPages.set(page.totalPages);
          this.totalElements.set(page.totalElements);
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadClients();
  }

  openCreate(): void {
    this.selectedClient.set(null);
    this.showForm.set(true);
  }

  openEdit(client: ClientResponse): void {
    this.selectedClient.set(client);
    this.showForm.set(true);
  }

  onFormClose(refresh: boolean): void {
    this.showForm.set(false);
    this.selectedClient.set(null);
    if (refresh) this.loadClients();
  }

  onDelete(client: ClientResponse): void {
    this.modal.confirm(
      `Are you sure you want to delete client "${client.name}"?`,
      () => this.deleteClient(client)
    );
  }

  private deleteClient(client: ClientResponse): void {
    this.clientService.delete(client.clientId)
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.modal.success(`Client deleted successfully.`);
        if (this.clients.length === 1 && this.currentPage() > 0) {
          this.currentPage.update(page => page - 1);
        }
        this.loadClients();
      });
  }

}
