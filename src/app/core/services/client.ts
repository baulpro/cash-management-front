import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PageResponse } from '../models/response/page-response.model';
import { ClientResponse } from '../models/response/client-response.model';
import { ClientRequest } from '../models/request/client-request.model';

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/clients`;

  findAll(search: string, page: number, size: number): Observable<PageResponse<ClientResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<PageResponse<ClientResponse>>(this.baseUrl, { params });
  }

  findById(id: string): Observable<ClientResponse> {
    return this.http.get<ClientResponse>(`${this.baseUrl}/${id}`);
  }

  create(client: ClientRequest): Observable<ClientResponse> {
    return this.http.post<ClientResponse>(this.baseUrl, client);
  }

  update(id: string, client: ClientRequest): Observable<ClientResponse> {
    return this.http.put<ClientResponse>(`${this.baseUrl}/${id}`, client);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
