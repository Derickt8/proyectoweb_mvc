export class CommissionSaleItemDto {
  saleId: string;
  saleDate: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  appliedPercentage: number;
  commission: number;
}

export class CommissionSellerSummaryDto {
  sellerId: string;
  sellerName: string;
  totalSold: number;
  appliedPercentage: number;
  totalCommission: number;
}

export class CommissionMetricsDto {
  totalSalesAmount: number;
  totalCommissionAmount: number;
  totalSalesCount: number;
  activeSellersCount: number;
}

export class CommissionCalculationResponseDto {
  startDate: string;
  endDate: string;
  sales: CommissionSaleItemDto[];
  summaries: CommissionSellerSummaryDto[];
  metrics: CommissionMetricsDto;
}
