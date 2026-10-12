import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommissionRule } from './entities/commission-rule.entity';
import { CommissionRuleController } from './commission-rule.controller';
import { CommissionRuleService } from './commission-rule.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommissionRule])],
  controllers: [CommissionRuleController],
  providers: [CommissionRuleService],
  exports: [CommissionRuleService],
})
export class CommissionRuleModule {}
