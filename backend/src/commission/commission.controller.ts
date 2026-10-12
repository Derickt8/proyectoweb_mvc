import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommissionService } from './commission.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Commissions')
@Controller('api/v1/commissions')
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener ventas con comisión calculada y paginación estándar' })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.commissionService.findAll(paginationDto);
  }

  @Get('by-seller')
  @ApiOperation({ summary: 'Obtener resumen agrupado por vendedor con comisiones y paginación' })
  async findSummariesBySeller(@Query() paginationDto: PaginationDto) {
    return this.commissionService.findSummariesBySeller(paginationDto);
  }
}
