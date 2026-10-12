import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../sale/entities/sale.entity';
import { CommissionRule } from '../commission-rule/entities/commission-rule.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(CommissionRule)
    private readonly ruleRepository: Repository<CommissionRule>,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      sortField = 'saleDate',
      sortOrder = 'desc',
      where,
    } = paginationDto;

    const queryBuilder = this.saleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.seller', 'seller');

    const parsedWhere = this.parseWhere(where);

    if (parsedWhere['startDate'] && parsedWhere['endDate']) {
      queryBuilder.andWhere('sale.saleDate BETWEEN :startDate AND :endDate', {
        startDate: parsedWhere['startDate'],
        endDate: parsedWhere['endDate'],
      });
    }

    if (parsedWhere['sellerId']) {
      queryBuilder.andWhere('sale.sellerId = :sellerId', {
        sellerId: parsedWhere['sellerId'],
      });
    }

    if (search && search.trim()) {
      queryBuilder.andWhere('seller.name LIKE :search', {
        search: `%${search.trim()}%`,
      });
    }

    const allowedSortFields = ['saleDate', 'amount', 'id'];
    const finalSortField = allowedSortFields.includes(sortField)
      ? `sale.${sortField}`
      : 'sale.saleDate';

    queryBuilder.orderBy(
      finalSortField,
      sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
    );

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [sales, total] = await queryBuilder.getManyAndCount();
    const rules = await this.ruleRepository.find({
      order: { minAmount: 'DESC' },
    });

    const data = sales.map((sale) => {
      const amount = Number(sale.amount);
      const matchingRule = rules.find((r) => amount >= Number(r.minAmount));
      const appliedPercentage = matchingRule ? Number(matchingRule.percentage) : 0;
      const commission = Number((amount * appliedPercentage).toFixed(2));

      return {
        id: sale.id,
        saleDate: sale.saleDate,
        amount,
        sellerId: sale.seller ? sale.seller.id : sale.sellerId,
        sellerName: sale.seller ? sale.seller.name : 'Desconocido',
        appliedPercentage,
        commission,
      };
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findSummariesBySeller(paginationDto: PaginationDto): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, search, where } = paginationDto;
    const parsedWhere = this.parseWhere(where);

    const queryBuilder = this.saleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.seller', 'seller');

    if (parsedWhere['startDate'] && parsedWhere['endDate']) {
      queryBuilder.andWhere('sale.saleDate BETWEEN :startDate AND :endDate', {
        startDate: parsedWhere['startDate'],
        endDate: parsedWhere['endDate'],
      });
    }

    if (search && search.trim()) {
      queryBuilder.andWhere('seller.name LIKE :search', {
        search: `%${search.trim()}%`,
      });
    }

    const sales = await queryBuilder.getMany();
    const rules = await this.ruleRepository.find({
      order: { minAmount: 'DESC' },
    });

    const sellerMap = new Map<
      string,
      { sellerId: string; sellerName: string; totalSold: number }
    >();

    for (const sale of sales) {
      const sellerId = sale.seller ? sale.seller.id : sale.sellerId;
      const sellerName = sale.seller ? sale.seller.name : 'Desconocido';
      const existing = sellerMap.get(sellerId) || {
        sellerId,
        sellerName,
        totalSold: 0,
      };
      existing.totalSold += Number(sale.amount);
      sellerMap.set(sellerId, existing);
    }

    const allSummaries = Array.from(sellerMap.values()).map((seller) => {
      const totalSold = Number(seller.totalSold.toFixed(2));
      const matchingRule = rules.find((r) => totalSold >= Number(r.minAmount));
      const appliedPercentage = matchingRule ? Number(matchingRule.percentage) : 0;
      const totalCommission = Number((totalSold * appliedPercentage).toFixed(2));

      return {
        sellerId: seller.sellerId,
        sellerName: seller.sellerName,
        totalSold,
        appliedPercentage,
        totalCommission,
      };
    });

    const total = allSummaries.length;
    const startIndex = (page - 1) * limit;
    const data = allSummaries.slice(startIndex, startIndex + limit);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async getMetrics(where?: any): Promise<{
    totalSalesAmount: number;
    totalCommissionAmount: number;
    totalSalesCount: number;
    activeSellersCount: number;
  }> {
    const parsedWhere = this.parseWhere(where);

    const queryBuilder = this.saleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.seller', 'seller');

    if (parsedWhere['startDate'] && parsedWhere['endDate']) {
      queryBuilder.andWhere('sale.saleDate BETWEEN :startDate AND :endDate', {
        startDate: parsedWhere['startDate'],
        endDate: parsedWhere['endDate'],
      });
    }

    if (parsedWhere['sellerId']) {
      queryBuilder.andWhere('sale.sellerId = :sellerId', {
        sellerId: parsedWhere['sellerId'],
      });
    }

    const sales = await queryBuilder.getMany();
    const rules = await this.ruleRepository.find({
      order: { minAmount: 'DESC' },
    });

    let totalSalesAmount = 0;
    let totalCommissionAmount = 0;
    const sellerSet = new Set<string>();

    for (const sale of sales) {
      const amount = Number(sale.amount);
      totalSalesAmount += amount;
      sellerSet.add(sale.sellerId);

      const matchingRule = rules.find((r) => amount >= Number(r.minAmount));
      const appliedPercentage = matchingRule ? Number(matchingRule.percentage) : 0;
      totalCommissionAmount += amount * appliedPercentage;
    }

    return {
      totalSalesAmount: Number(totalSalesAmount.toFixed(2)),
      totalCommissionAmount: Number(totalCommissionAmount.toFixed(2)),
      totalSalesCount: sales.length,
      activeSellersCount: sellerSet.size,
    };
  }

  private parseWhere(where?: any): Record<string, any> {
    if (!where) return {};
    if (typeof where === 'string') {
      try {
        return JSON.parse(where);
      } catch {
        return {};
      }
    }
    return where;
  }
}
