import { RowAction } from '@/app/core/utils/index.type';
import { PaginationResponse } from '@/app/core/utils/pagination.type';
import { StatusEnum } from '@/app/core/utils/status.type';

export type Seller = {
  id: string;
  name: string;
  email?: string;
  status?: StatusEnum;
};

export type Commission = {
  id: string;
  saleDate: string;
  amount: number;
  sellerId: string;
  sellerName?: string;
  seller?: Seller;
  appliedPercentage: number;
  commission: number;
};

export type CommissionRow = Commission & {
  recordNumber: number;
  actions?: RowAction[];
};

export type CommissionResponse = PaginationResponse<Commission>;

export type CommissionSummary = {
  sellerId: string;
  sellerName: string;
  totalSold: number;
  appliedPercentage: number;
  totalCommission: number;
};

export type CommissionSummaryRow = CommissionSummary & {
  recordNumber: number;
  actions?: RowAction[];
};

export type CommissionSummaryResponse = PaginationResponse<CommissionSummary>;
