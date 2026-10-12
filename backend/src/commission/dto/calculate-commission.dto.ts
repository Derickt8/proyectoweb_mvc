import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class CalculateCommissionDto {
  @ApiProperty({
    description: 'Fecha de inicio del rango de cálculo en formato ISO 8601 (YYYY-MM-DD)',
    example: '2025-05-01',
  })
  @IsNotEmpty({ message: 'startDate is required' })
  @IsDateString({}, { message: 'startDate must be a valid ISO 8601 date string (YYYY-MM-DD)' })
  startDate: string;

  @ApiProperty({
    description: 'Fecha de fin del rango de cálculo en formato ISO 8601 (YYYY-MM-DD)',
    example: '2025-06-30',
  })
  @IsNotEmpty({ message: 'endDate is required' })
  @IsDateString({}, { message: 'endDate must be a valid ISO 8601 date string (YYYY-MM-DD)' })
  endDate: string;
}
