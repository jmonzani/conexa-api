import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return user details', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password',
        role: 'admin',
      };

      const mockUser = { id: 1, username: 'testuser', role: 'admin' };
      mockAuthService.register.mockResolvedValue(mockUser);

      const result = await controller.register(createUserDto);

      expect(result).toEqual({ id: 1, username: 'testuser', role: 'admin' });
      expect(mockAuthService.register).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an error if registration fails', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password',
        role: 'admin',
      };

      mockAuthService.register.mockRejectedValue(
        new Error('Registration failed'),
      );

      await expect(controller.register(createUserDto)).rejects.toThrowError(
        'Registration failed',
      );
    });
  });

  describe('login', () => {
    it('should log in a user and return a token', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password',
      };

      const mockUser = { id: 1, username: 'testuser', role: 'admin' };
      const mockToken = 'jwt.token.here';

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(mockToken);

      const result = await controller.login(loginDto);

      expect(result).toEqual(mockToken);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        loginDto.username,
        loginDto.password,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        username: 'wronguser',
        password: 'wrongpassword',
      };

      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
