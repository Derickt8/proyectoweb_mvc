import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CommissionCalculationResponse,
  CommissionFilterPayload,
  CommissionSaleItem,
  CreateSalePayload,
  Seller,
} from './commission.types';

@Injectable({ providedIn: 'root' })
export class CommissionService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _apiUrl = `${environment.apiUrl}/commissions`;
  private readonly _sellersUrl = `${environment.apiUrl}/sellers`;
  private readonly _salesUrl = `${environment.apiUrl}/sales`;

  calculateCommissions(
    payload: CommissionFilterPayload,
  ): Observable<CommissionCalculationResponse> {
    return this._httpClient.post<CommissionCalculationResponse>(
      `${this._apiUrl}/calculate`,
      payload,
    );
  }

  getSellers(): Observable<Seller[]> {
    return this._httpClient.get<Seller[]>(this._sellersUrl);
  }

  createSale(payload: CreateSalePayload): Observable<CommissionSaleItem> {
    return this._httpClient.post<CommissionSaleItem>(this._salesUrl, payload);
  }
}
