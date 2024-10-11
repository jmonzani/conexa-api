import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import {
  FIND_ALL,
  ACCESS_DENIED,
  FIND_ONE_SUCCESS,
  CREATE_SUCCESS,
  UPDATE_SUCCESS,
  REMOVE_SUCCESS,
  SYNC_SUCCESS,
} from 'src/swagger/movies';

@ApiTags('movies')
@ApiBearerAuth()
@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @ApiOperation({ summary: 'Get all the movies' })
  @ApiResponse(FIND_ALL)
  @Get()
  async findAll() {
    return this.moviesService.findAll();
  }

  @ApiOperation({ summary: 'Get one specific movie' })
  @ApiResponse(FIND_ONE_SUCCESS)
  @ApiResponse(ACCESS_DENIED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('regular')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const movie = await this.moviesService.findOne(id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse(CREATE_SUCCESS)
  @ApiResponse(ACCESS_DENIED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @ApiOperation({ summary: 'Update a movie data' })
  @ApiResponse(UPDATE_SUCCESS)
  @ApiResponse(ACCESS_DENIED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @ApiOperation({ summary: 'Delete a movie' })
  @ApiResponse(REMOVE_SUCCESS)
  @ApiResponse(ACCESS_DENIED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.moviesService.remove(id);
  }

  @ApiOperation({ summary: 'Get movies from Star Wars open API' })
  @ApiResponse(SYNC_SUCCESS)
  @ApiResponse(ACCESS_DENIED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('sync')
  async sync(@Request() req) {
    await this.moviesService.syncWithStarWarsAPI();
    return { message: 'Movies from Star Wars API added' };
  }
}
