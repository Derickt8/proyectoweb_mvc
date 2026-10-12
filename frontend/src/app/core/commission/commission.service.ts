import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import {
  Commission,
  CommissionResponse,
  CommissionSummaryResponse,
  Seller,
} from './commission.types';

@Injectable({
  providedIn: 'root',
})
export class CommissionService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _apiUrl = `${environment.apiUrl}/commissions`;
  private readonly _sellersUrl = `${environment.apiUrl}/sellers`;
  private readonly _salesUrl = `${environment.apiUrl}/sales`;

  findAll(
    page = 1,
    limit = 10,
    where: Record<string, unknown> = {},
    search?: string,
    sortField = 'saleDate',
    sortOrder: 'asc' | 'desc' = 'desc',
  ): Observable<CommissionResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField)
      .set('sortOrder', sortOrder);

    if (Object.keys(where).length > 0) {
      params = params.set('where', JSON.stringify(where));
    }
    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    return this._httpClient.get<CommissionResponse>(this._apiUrl, { params });
  }

  findSummariesBySeller(
    page = 1,
    limit = 10,
    where: Record<string, unknown> = {},
    search?: string,
  ): Observable<CommissionSummaryResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (Object.keys(where).length > 0) {
      params = params.set('where', JSON.stringify(where));
    }
    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    return this._httpClient.get<CommissionSummaryResponse>(
      `${this._apiUrl}/by-seller`,
      { params },
    );
  }

  getSellers(): Observable<Seller[]> {
    return this._httpClient.get<Seller[]>(this._sellersUrl);
  }

  createSale(data: Partial<Commission>): Observable<Commission> {
    return this._httpClient.post<Commission>(this._salesUrl, data);
  }
}
