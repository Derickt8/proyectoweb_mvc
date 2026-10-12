import { IsNotEmpty, Min, Max, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({
    description: 'Pagination page',
    minimum: 1,
    default: 1,
    required: true,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  readonly page: number = 1;

  @ApiProperty({
    description: 'Pagination limit',
    minimum: 10,
    default: 10,
    required: true,
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(10)
  @Max(100)
  readonly limit: number = 10;

  @ApiProperty({
    description: 'Search term',
    required: false,
  })
  @IsOptional()
  readonly search?: string;

  @ApiProperty({
    description: 'Sort field',
    default: 'createdAt',
    required: false,
  })
  @IsOptional()
  readonly sortField?: string;

  @ApiProperty({
    description: 'Sort order',
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  readonly sortOrder?: 'asc' | 'desc';

  @ApiProperty({
    description: 'Conditions',
    required: false,
    type: Object,
  })
  @IsOptional()
  readonly where?: Record<string, any>;
}
