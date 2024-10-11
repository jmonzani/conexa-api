import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MovieDto } from './dto/movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService implements OnModuleInit {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    private httpService: HttpService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.syncWithStarWarsAPI();
  }

  findAll(): Promise<Movie[]> {
    return this.moviesRepository.find();
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.moviesRepository.findOne({ where: { id } });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  async create(movieData: Partial<MovieDto>): Promise<Movie> {
    const newMovie = this.moviesRepository.create({
      episode_number: movieData.episodeNumber,
      title: movieData.title,
      director: movieData.director,
      release_date: movieData.releaseDate,
      description: movieData.description,
    });

    return this.moviesRepository.save(newMovie);
  }

  async update(
    id: number,
    updateMovieDto: Partial<UpdateMovieDto>,
  ): Promise<Movie> {
    const movie = await this.findOne(id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    Object.assign(movie, updateMovieDto);
    return this.moviesRepository.save(movie);
  }

  async remove(id: number): Promise<void> {
    const movie = await this.findOne(id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    await this.moviesRepository.remove(movie);
  }

  async syncWithStarWarsAPI(): Promise<void> {
    let nextUrl = 'https://swapi.dev/api/films/';
    const movies: any[] = [];

    while (nextUrl) {
      const response = await firstValueFrom(this.httpService.get(nextUrl));
      movies.push(...response.data.results);
      nextUrl = response.data.next;
    }

    for (const movie of movies) {
      const existingMovie = await this.moviesRepository.findOne({
        where: { episode_number: movie.episode_number },
      });

      if (existingMovie) {
        existingMovie.title = movie.title;
        existingMovie.director = movie.director;
        existingMovie.release_date = movie.release_date;
        existingMovie.description = movie.description;
        await this.moviesRepository.save(existingMovie);
      } else {
        const newMovie = this.moviesRepository.create({
          episode_number: movie.episode_number,
          title: movie.title,
          director: movie.director,
          release_date: movie.release_date,
          description: movie.description,
        });
        await this.moviesRepository.save(newMovie);
      }
    }
  }
}
