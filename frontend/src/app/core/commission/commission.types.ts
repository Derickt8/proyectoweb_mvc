export type ButtonCustomType = {
  title: string;
  icon: string;
  class: string;
};

export type CommissionTabType = 'sales' | 'sellers';

export interface CommissionSaleItem {
  saleId: string;
  saleDate: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  appliedPercentage: number;
  commission: number;
}

export interface CommissionSellerSummary {
  sellerId: string;
  sellerName: string;
  totalSold: number;
  appliedPercentage: number;
  totalCommission: number;
}

export interface CommissionMetrics {
  totalSalesAmount: number;
  totalCommissionAmount: number;
  totalSalesCount: number;
  activeSellersCount: number;
}

export interface CommissionCalculationResponse {
  startDate: string;
  endDate: string;
  sales: CommissionSaleItem[];
  summaries: CommissionSellerSummary[];
  metrics: CommissionMetrics;
}

export interface CommissionFilterPayload {
  startDate: string;
  endDate: string;
}

export interface Seller {
  id: string;
  name: string;
  email?: string;
}

export interface CreateSalePayload {
  sellerId: string;
  saleDate: string;
  amount: number;
}
