import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MovieDto {
  @ApiProperty({description: "Movie title"})
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({description: "Directors name"})
  @IsString()
  @IsNotEmpty()
  director: string;

  @ApiProperty({description: "Movies premier date"})
  @IsString()
  @IsNotEmpty()
  releaseDate: string;

  @ApiProperty({description: "Episode Number"})
  @IsInt()
  episodeNumber: number;

  @ApiProperty({description: "Movies introduction"})
  @IsString()
  @IsNotEmpty()
  description: string;
}
