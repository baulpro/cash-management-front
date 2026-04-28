import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ReportRequest } from '../models/request/report-request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/reports`;

  generateTransactionReport(request: ReportRequest): Observable<HttpResponse<Blob>> {
    return this.http.post(`${this.baseUrl}/transactions`, request, {
      responseType: 'blob',
      observe: 'response',
    });
  }
}
