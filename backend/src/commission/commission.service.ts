import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Sale } from '../sale/entities/sale.entity';
import { CommissionRule } from '../commission-rule/entities/commission-rule.entity';
import { CalculateCommissionDto } from './dto/calculate-commission.dto';
import {
  CommissionCalculationResponseDto,
  CommissionMetricsDto,
  CommissionSaleItemDto,
  CommissionSellerSummaryDto,
} from './dto/commission-result.dto';

@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(CommissionRule)
    private readonly ruleRepository: Repository<CommissionRule>,
  ) {}

  async calculateCommissions(
    dto: CalculateCommissionDto,
  ): Promise<CommissionCalculationResponseDto> {
    const { startDate, endDate } = dto;

    const sales = await this.saleRepository.find({
      where: {
        saleDate: Between(startDate, endDate),
      },
      relations: ['seller'],
      order: {
        saleDate: 'ASC',
      },
    });

    const rules = await this.ruleRepository.find({
      order: {
        minAmount: 'DESC',
      },
    });

    const detailedSales: CommissionSaleItemDto[] = sales.map((sale) => {
      const numericAmount = Number(sale.amount);
      const matchingRule = rules.find(
        (rule) => numericAmount >= Number(rule.minAmount),
      );
      const appliedPercentage = matchingRule
        ? Number(matchingRule.percentage)
        : 0;
      const commission = Number(
        (numericAmount * appliedPercentage).toFixed(2),
      );

      return {
        saleId: sale.id,
        saleDate: sale.saleDate,
        sellerId: sale.seller ? sale.seller.id : sale.sellerId,
        sellerName: sale.seller ? sale.seller.name : 'Vendedor Desconocido',
        amount: numericAmount,
        appliedPercentage,
        commission,
      };
    });

    const sellerMap = new Map<
      string,
      { sellerId: string; sellerName: string; totalSold: number }
    >();

    for (const sale of sales) {
      const sellerId = sale.seller ? sale.seller.id : sale.sellerId;
      const sellerName = sale.seller ? sale.seller.name : 'Vendedor Desconocido';
      const existing = sellerMap.get(sellerId) || {
        sellerId,
        sellerName,
        totalSold: 0,
      };
      existing.totalSold += Number(sale.amount);
      sellerMap.set(sellerId, existing);
    }

    const summaries: CommissionSellerSummaryDto[] = Array.from(
      sellerMap.values(),
    ).map((seller) => {
      const totalSold = Number(seller.totalSold.toFixed(2));
      const matchingRule = rules.find(
        (rule) => totalSold >= Number(rule.minAmount),
      );
      const appliedPercentage = matchingRule
        ? Number(matchingRule.percentage)
        : 0;
      const totalCommission = Number(
        (totalSold * appliedPercentage).toFixed(2),
      );

      return {
        sellerId: seller.sellerId,
        sellerName: seller.sellerName,
        totalSold,
        appliedPercentage,
        totalCommission,
      };
    });

    const totalSalesAmount = Number(
      detailedSales
        .reduce((sum, item) => sum + item.amount, 0)
        .toFixed(2),
    );
    const totalCommissionAmount = Number(
      detailedSales
        .reduce((sum, item) => sum + item.commission, 0)
        .toFixed(2),
    );

    const metrics: CommissionMetricsDto = {
      totalSalesAmount,
      totalCommissionAmount,
      totalSalesCount: detailedSales.length,
      activeSellersCount: sellerMap.size,
    };

    return {
      startDate,
      endDate,
      sales: detailedSales,
      summaries,
      metrics,
    };
  }
}
