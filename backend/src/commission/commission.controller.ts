import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommissionService } from './commission.service';
import { CalculateCommissionDto } from './dto/calculate-commission.dto';
import { CommissionCalculationResponseDto } from './dto/commission-result.dto';

@ApiTags('Commissions')
@Controller('api/v1/commissions')
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calcular comisiones para un rango de fechas (POST)' })
  async calculateCommissionsPost(
    @Body() dto: CalculateCommissionDto,
  ): Promise<CommissionCalculationResponseDto> {
    return this.commissionService.calculateCommissions(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Consultar comisiones por rango de fechas (GET)' })
  async calculateCommissionsGet(
    @Query() dto: CalculateCommissionDto,
  ): Promise<CommissionCalculationResponseDto> {
    return this.commissionService.calculateCommissions(dto);
  }
}
