import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Seller } from '../seller/entities/seller.entity';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {}

  async findAll(): Promise<Sale[]> {
    return this.saleRepository.find({
      relations: ['seller'],
      order: { saleDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['seller'],
    });
    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    return sale;
  }

  async create(dto: CreateSaleDto): Promise<Sale> {
    const seller = await this.sellerRepository.findOne({
      where: { id: dto.sellerId },
    });
    if (!seller) {
      throw new NotFoundException(`Seller with ID ${dto.sellerId} not found`);
    }

    const sale = this.saleRepository.create({
      saleDate: dto.saleDate,
      amount: dto.amount,
      seller,
      sellerId: seller.id,
    });

    return this.saleRepository.save(sale);
  }
}
