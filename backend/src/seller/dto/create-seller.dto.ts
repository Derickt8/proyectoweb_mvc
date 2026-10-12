import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSellerDto {
  @ApiProperty({ example: 'Anderson Guaman', description: 'Nombre completo del vendedor' })
  @IsNotEmpty({ message: 'name is required' })
  @IsString({ message: 'name must be a string' })
  name: string;

  @ApiProperty({ example: 'anderson@example.com', required: false, description: 'Correo electrónico' })
  @IsOptional()
  @IsEmail({}, { message: 'email must be a valid email' })
  email?: string;
}
