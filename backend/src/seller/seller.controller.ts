import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { Seller } from './entities/seller.entity';

@ApiTags('Sellers')
@Controller('api/v1/sellers')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los vendedores' })
  async findAll(): Promise<Seller[]> {
    return this.sellerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un vendedor por ID' })
  async findOne(@Param('id') id: string): Promise<Seller> {
    return this.sellerService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo vendedor' })
  async create(@Body() dto: CreateSellerDto): Promise<Seller> {
    return this.sellerService.create(dto);
  }
}
