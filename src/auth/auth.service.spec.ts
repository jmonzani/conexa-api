import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

const mockUser = {
  id: 1,
  username: 'admin',
  password: 'password',
  role: 'admin',
  validatePassword: jest.fn().mockResolvedValue(true),
  hashPassword: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByUsername: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'signed-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return the user if the credentials are valid', async () => {
      jest.spyOn(usersService, 'findByUsername').mockResolvedValue(mockUser);

      const result = await service.validateUser('test', 'password');
      expect(result).toEqual(mockUser);
    });

    it('should return null if credentials are invalid', async () => {
      jest.spyOn(usersService, 'findByUsername').mockResolvedValue(null);

      const result = await service.validateUser('wrong-user', 'wrong-password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const result = await service.login(mockUser);
      expect(result).toEqual({ access_token: 'signed-token' });
    });
  });
});
