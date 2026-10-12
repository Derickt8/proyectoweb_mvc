import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './seller/entities/seller.entity';
import { Sale } from './sale/entities/sale.entity';
import { CommissionRule } from './commission-rule/entities/commission-rule.entity';
import { CommissionModule } from './commission/commission.module';
import { SellerModule } from './seller/seller.module';
import { SaleModule } from './sale/sale.module';
import { CommissionRuleModule } from './commission-rule/commission-rule.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_STORAGE || 'commissions.sqlite',
      entities: [Seller, Sale, CommissionRule],
      synchronize: true,
    }),
    SellerModule,
    SaleModule,
    CommissionRuleModule,
    CommissionModule,
    DatabaseModule,
  ],
})
export class AppModule {}
