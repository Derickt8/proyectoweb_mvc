import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from './entities/sale.entity';

@ApiTags('Sales')
@Controller('api/v1/sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las ventas registradas' })
  async findAll(): Promise<Sale[]> {
    return this.saleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una venta por ID' })
  async findOne(@Param('id') id: string): Promise<Sale> {
    return this.saleService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva venta' })
  async create(@Body() dto: CreateSaleDto): Promise<Sale> {
    return this.saleService.create(dto);
  }
}
