import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TransactionFilters } from '../models/bo/transaction.model';
import { Observable } from 'rxjs';
import { PageResponse } from '../models/response/page-response.model';
import { TransactionResponse } from '../models/response/transaction-response.model';
import { TransactionRequest } from '../models/request/transaction-request.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/transactions`;

  findAll(filters: TransactionFilters, page: number, size: number)
    : Observable<PageResponse<TransactionResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters.accountNumber?.trim()) {
      params = params.set('accountNumber', filters.accountNumber.trim());
    }
    if (filters.clientName?.trim()) {
      params = params.set('clientName', filters.clientName.trim());
    }
    if (filters.startDate) {
      params = params.set('startDate', `${filters.startDate}T00:00:00`);
    }
    if (filters.endDate) {
      params = params.set('endDate', `${filters.endDate}T23:59:59`);
    }
    return this.http.get<PageResponse<TransactionResponse>>(this.baseUrl, { params });
  }

  create(transaction: TransactionRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(this.baseUrl, transaction);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }


}
