import { MovieDto } from 'src/movies/dto/movie.dto';

export const ACCESS_DENIED = { status: 403, description: 'Access denied.' };

export const FIND_ALL = {
  status: 200,
  description: 'Lista de películas devuelta exitosamente.',
  isArray: true,
  type: MovieDto,
};

export const FIND_ONE_SUCCESS = {
  status: 200,
  description: 'Movie found successfully.',
  type: MovieDto,
};

export const CREATE_SUCCESS = {
  status: 201,
  description: 'Movie created successfully.',
  type: MovieDto,
};

export const UPDATE_SUCCESS = {
  status: 200,
  description: 'Movie updated successfully.',
  type: MovieDto,
};

export const REMOVE_SUCCESS = {
  status: 204,
  description: 'Movie removed successfully from database.',
  type: MovieDto,
};

export const SYNC_SUCCESS = {
  status: 200,
  description: 'Got movies from Star Wars open API successfully.',
  type: MovieDto,
};
