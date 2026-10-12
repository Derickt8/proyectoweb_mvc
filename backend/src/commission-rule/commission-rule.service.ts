import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommissionRule } from './entities/commission-rule.entity';
import { CreateCommissionRuleDto } from './dto/create-commission-rule.dto';

@Injectable()
export class CommissionRuleService {
  constructor(
    @InjectRepository(CommissionRule)
    private readonly ruleRepository: Repository<CommissionRule>,
  ) {}

  async findAll(): Promise<CommissionRule[]> {
    return this.ruleRepository.find({
      order: { minAmount: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CommissionRule> {
    const rule = await this.ruleRepository.findOne({ where: { id } });
    if (!rule) {
      throw new NotFoundException(`Rule with ID ${id} not found`);
    }
    return rule;
  }

  async create(dto: CreateCommissionRuleDto): Promise<CommissionRule> {
    const rule = this.ruleRepository.create(dto);
    return this.ruleRepository.save(rule);
  }
}
