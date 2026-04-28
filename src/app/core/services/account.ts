import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AccountFilters } from '../models/bo/account.model';
import { AccountResponse } from '../models/response/account-response.model';
import { PageResponse } from '../models/response/page-response.model';
import { Observable } from 'rxjs';
import { AccountRequest } from '../models/request/account-request.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/accounts`;

  findAll(filters: AccountFilters, page: number, size: number)
    : Observable<PageResponse<AccountResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters.accountNumber?.trim()) {
      params = params.set('accountNumber', filters.accountNumber.trim());
    }
    if (filters.typeAccount) {
      params = params.set('typeAccount', filters.typeAccount);
    }
    if (filters.clientName?.trim()) {
      params = params.set('clientName', filters.clientName.trim());
    }
    return this.http.get<PageResponse<AccountResponse>>(this.baseUrl, { params });
  }

  findById(id: string): Observable<AccountResponse> {
    return this.http.get<AccountResponse>(`${this.baseUrl}/${id}`);
  }

  create(account: AccountRequest): Observable<AccountResponse> {
    return this.http.post<AccountResponse>(this.baseUrl, account);
  }

  update(id: string, account: AccountRequest): Observable<AccountResponse> {
    return this.http.put<AccountResponse>(`${this.baseUrl}/${id}`, account);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
