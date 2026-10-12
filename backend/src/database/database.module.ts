import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from '../seller/entities/seller.entity';
import { Sale } from '../sale/entities/sale.entity';
import { CommissionRule } from '../commission-rule/entities/commission-rule.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Seller, Sale, CommissionRule]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {}
