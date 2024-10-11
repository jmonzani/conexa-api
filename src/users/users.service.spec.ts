import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUser: User = {
    id: 1,
    username: 'testUser',
    password: 'testPassword',
    role: 'regular',
    hashPassword: jest.fn(),
    validatePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUsername', () => {
    it('should return a user if username exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByUsername('testUser');
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'testUser' },
      });
    });

    it('should return undefined if username does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined);

      const result = await service.findByUsername('nonexistentUser');
      expect(result).toBeUndefined();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'nonexistentUser' },
      });
    });
  });

  describe('findById', () => {
    it('should return a user if ID exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById(1);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return undefined if ID does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined);

      const result = await service.findById(999);
      expect(result).toBeUndefined();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const newUser = {
        username: 'adminUser',
        password: 'password',
        role: 'admin',
      };

      mockUserRepository.create.mockReturnValue(newUser);
      mockUserRepository.save.mockResolvedValue({ id: 2, ...newUser });

      const result = await service.create(newUser);
      expect(result).toEqual({ id: 2, ...newUser });
      expect(mockUserRepository.create).toHaveBeenCalledWith(newUser);
      expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
    });
  });
});
