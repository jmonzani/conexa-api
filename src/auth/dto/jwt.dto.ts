import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class JwtDto {
  @ApiProperty({ description: 'JWT to use for authorization purposes' })
  @IsString()
  @IsNotEmpty()
  jwt: string;
}
