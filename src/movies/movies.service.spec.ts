import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

describe('MoviesService', () => {
  let service: MoviesService;
  let repository: Repository<Movie>;
  let httpService: HttpService;

  const mockMovie = {
    id: 1,
    episode_umber: 19,
    title: 'title mock',
    director: 'director mock',
    release_date: '1977-05-25',
    description: 'description mock',
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockRepository,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const request = context.switchToHttp().getRequest();
          request.user = { id: 1, username: 'adminUser', role: 'admin' };
          return true;
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: (context) => {
          const request = context.switchToHttp().getRequest();
          return request.user.role === 'admin';
        },
      })
      .compile();

    service = module.get<MoviesService>(MoviesService);
    repository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all movies', async () => {
      const movies = [mockMovie];
      mockRepository.find.mockResolvedValue(movies);

      const result = await service.findAll();
      expect(result).toEqual(movies);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one movie', async () => {
      mockRepository.findOne.mockResolvedValue(mockMovie);

      const result = await service.findOne(1);
      expect(result).toEqual(mockMovie);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const createMovieDto: CreateMovieDto = {
        episodeNumber: 19,
        title: 'title mock',
        director: 'director mock',
        releaseDate: '1977-05-25',
        description: 'description mock',
      };

      mockRepository.create.mockReturnValue(mockMovie);
      mockRepository.save.mockResolvedValue(mockMovie);

      const result = await service.create(createMovieDto);
      expect(result).toEqual(mockMovie);
      expect(repository.create).toHaveBeenCalledWith({
        episode_number: createMovieDto.episodeNumber,
        title: createMovieDto.title,
        director: createMovieDto.director,
        release_date: createMovieDto.releaseDate,
        description: createMovieDto.description,
      });
      expect(repository.save).toHaveBeenCalledWith(mockMovie);
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: 'mock updated title',
      };

      mockRepository.findOne.mockResolvedValue(mockMovie);
      mockRepository.save.mockResolvedValue({
        ...mockMovie,
        ...updateMovieDto,
      });

      const result = await service.update(1, updateMovieDto);
      expect(result).toEqual({ ...mockMovie, ...updateMovieDto });
      expect(repository.save).toHaveBeenCalledWith({
        ...mockMovie,
        ...updateMovieDto,
      });
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should allow admin user to delete a movie', async () => {
      mockRepository.findOne.mockResolvedValue(mockMovie);
      mockRepository.remove.mockResolvedValue(undefined);

      await service.remove(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.remove).toHaveBeenCalledWith(mockMovie);
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('syncWithStarWarsAPI', () => {
    it('should sync movies with Star Wars API', async () => {
      const apiMovies = [
        {
          episode_number: 19,
          title: 'title mock',
          director: 'director mock',
          release_date: '1977-05-25',
          description: 'description mock',
        },
      ];

      mockHttpService.get.mockReturnValue(
        of({ data: { results: apiMovies, next: null } }),
      );
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockMovie);
      mockRepository.save.mockResolvedValue(mockMovie);

      await service.syncWithStarWarsAPI();
      expect(httpService.get).toHaveBeenCalledWith(
        'https://swapi.dev/api/films/',
      );
      expect(repository.create).toHaveBeenCalledWith({
        episode_number: apiMovies[0].episode_number,
        title: apiMovies[0].title,
        director: apiMovies[0].director,
        release_date: apiMovies[0].release_date,
        description: apiMovies[0].description,
      });
      expect(repository.save).toHaveBeenCalled();
    });
  });
});
