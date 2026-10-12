import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from '../sale/entities/sale.entity';
import { CommissionRule } from '../commission-rule/entities/commission-rule.entity';
import { CommissionController } from './commission.controller';
import { CommissionService } from './commission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, CommissionRule])],
  controllers: [CommissionController],
  providers: [CommissionService],
  exports: [CommissionService],
})
export class CommissionModule {}
