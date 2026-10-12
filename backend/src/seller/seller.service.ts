import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './entities/seller.entity';
import { CreateSellerDto } from './dto/create-seller.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {}

  async findAll(): Promise<Seller[]> {
    return this.sellerRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Seller> {
    const seller = await this.sellerRepository.findOne({ where: { id } });
    if (!seller) {
      throw new NotFoundException(`Seller with ID ${id} not found`);
    }
    return seller;
  }

  async create(dto: CreateSellerDto): Promise<Seller> {
    const seller = this.sellerRepository.create(dto);
    return this.sellerRepository.save(seller);
  }
}
