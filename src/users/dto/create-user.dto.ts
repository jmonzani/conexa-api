import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Unique user name' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Users password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Users role',
    required: false,
    default: 'regular',
  })
  @IsString()
  @IsOptional()
  @IsIn(['regular', 'admin'], {
    message: 'Role must be either regular or admin',
  })
  role?: string;
}
