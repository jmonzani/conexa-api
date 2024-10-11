import { LoginDto } from 'src/auth/dto/login.dto';
import { JwtDto } from 'src/auth/dto/jwt.dto';

export const ACCESS_DENIED = { status: 403, description: 'Access denied.' };

export const REGISTER_SUCCESS = {
  status: 201,
  description: 'User registration completed successfully.',
  type: LoginDto,
};

export const REGISTER_FAILURE = {
  status: 400,
  description: 'Invalid input data.',
};

export const LOGIN_SUCCESS = {
  status: 200,
  description: 'Login successfull.',
  type: JwtDto,
};

export const LOGIN_FAILURE = {
  status: 401,
  description: 'Invalid credentials.',
};
