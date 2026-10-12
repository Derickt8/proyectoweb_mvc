import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateSaleDto {
  @ApiProperty({ example: '2025-05-20', description: 'Fecha de la venta (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'saleDate is required' })
  @IsDateString({}, { message: 'saleDate must be an ISO 8601 date string (YYYY-MM-DD)' })
  saleDate: string;

  @ApiProperty({ example: 400.0, description: 'Monto total de la venta en dólares' })
  @IsNotEmpty({ message: 'amount is required' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'amount must be a valid number' })
  @Min(0.01, { message: 'amount must be greater than 0' })
  amount: number;

  @ApiProperty({ example: 'uuid-vendedor', description: 'Identificador del vendedor' })
  @IsNotEmpty({ message: 'sellerId is required' })
  sellerId: string;
}
