import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ForbiddenException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let usersService: UsersService;

  const mockUser = {
    id: 1,
    username: 'testUser',
    role: 'admin',
  };

  const mockUsersService = {
    findById: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: jest.fn((context) => {
          const request = context.switchToHttp().getRequest();
          if (request.user.role !== 'admin') {
            throw new ForbiddenException();
          }
          return true;
        }),
      })
      .compile();

    controller = module.get<UserController>(UserController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfileById', () => {
    it('should return the profile of the logged-in user', async () => {
      const req = { user: { userId: 1 } };
      const result = await controller.getProfileById(req);
      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        role: mockUser.role,
      });
      expect(usersService.findById).toHaveBeenCalledWith(1);
    });
  });
});
