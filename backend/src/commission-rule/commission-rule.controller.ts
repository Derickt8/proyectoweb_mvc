import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommissionRuleService } from './commission-rule.service';
import { CreateCommissionRuleDto } from './dto/create-commission-rule.dto';
import { CommissionRule } from './entities/commission-rule.entity';

@ApiTags('Commission Rules')
@Controller('api/v1/commission-rules')
export class CommissionRuleController {
  constructor(private readonly ruleService: CommissionRuleService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las reglas de comisión' })
  async findAll(): Promise<CommissionRule[]> {
    return this.ruleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una regla de comisión por ID' })
  async findOne(@Param('id') id: string): Promise<CommissionRule> {
    return this.ruleService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva regla de comisión' })
  async create(@Body() dto: CreateCommissionRuleDto): Promise<CommissionRule> {
    return this.ruleService.create(dto);
  }
}
