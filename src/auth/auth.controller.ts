import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import {
  REGISTER_FAILURE,
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from 'src/swagger/auth';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse(REGISTER_SUCCESS)
  @ApiResponse(REGISTER_FAILURE)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    return { id: user.id, username: user.username, role: user.role };
  }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse(LOGIN_SUCCESS)
  @ApiResponse(LOGIN_FAILURE)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
