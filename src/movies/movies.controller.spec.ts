import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockMoviesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    syncWithStarWarsAPI: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  describe('findAll', () => {
    it('should return all movies', async () => {
      const mockMovies = [{ id: 1, title: 'mock title' }];
      mockMoviesService.findAll.mockResolvedValue(mockMovies);

      const result = await controller.findAll();
      expect(result).toEqual(mockMovies);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a movie if found', async () => {
      const mockMovie = { id: 1, title: 'mock title' };
      mockMoviesService.findOne.mockResolvedValue(mockMovie);

      const result = await controller.findOne(1);
      expect(result).toEqual(mockMovie);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockMoviesService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a movie', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'title mock',
        director: 'director mock',
        releaseDate: '1977-05-25',
        episodeNumber: 19,
        description: 'description mock',
      };
      const mockMovie = { id: 1, ...createMovieDto };
      mockMoviesService.create.mockResolvedValue(mockMovie);

      const result = await controller.create(createMovieDto);
      expect(result).toEqual(mockMovie);
      expect(service.create).toHaveBeenCalledWith(createMovieDto);
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: 'updated mock title',
      };
      const mockUpdatedMovie = { id: 1, ...updateMovieDto };
      mockMoviesService.update.mockResolvedValue(mockUpdatedMovie);

      const result = await controller.update(1, updateMovieDto);
      expect(result).toEqual(mockUpdatedMovie);
      expect(service.update).toHaveBeenCalledWith(1, updateMovieDto);
    });
  });

  describe('remove', () => {
    it('should remove a movie', async () => {
      mockMoviesService.remove.mockResolvedValue(undefined);

      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('sync', () => {
    it('should sync movies with Star Wars API', async () => {
      const message = { message: 'Movies from Star Wars API added' };
      mockMoviesService.syncWithStarWarsAPI.mockResolvedValue(message);

      const result = await controller.sync({});
      expect(result).toEqual(message);
      expect(service.syncWithStarWarsAPI).toHaveBeenCalled();
    });
  });
});
