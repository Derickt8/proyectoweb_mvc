import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCommissionRuleDto {
  @ApiProperty({ example: 1, description: 'Número de regla' })
  @IsNotEmpty({ message: 'ruleNumber is required' })
  @IsInt({ message: 'ruleNumber must be an integer' })
  ruleNumber: number;

  @ApiProperty({ example: 600, description: 'Monto mínimo para aplicar la regla' })
  @IsNotEmpty({ message: 'minAmount is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'minAmount must be a number' })
  @Min(0, { message: 'minAmount must be >= 0' })
  minAmount: number;

  @ApiProperty({ example: 0.06, description: 'Porcentaje en formato decimal (ej: 0.06 para 6%)' })
  @IsNotEmpty({ message: 'percentage is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'percentage must be a number' })
  @Min(0, { message: 'percentage must be >= 0' })
  percentage: number;

  @ApiProperty({ example: 'Ventas mayores o iguales a $600', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
