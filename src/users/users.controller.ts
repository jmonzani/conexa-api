import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ACCESS_DENIED, USER_PROFILE_SUCCES } from 'src/swagger/user';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get logged in user information' })
  @ApiResponse(USER_PROFILE_SUCCES)
  @ApiResponse(ACCESS_DENIED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'regular')
  @Get('profile')
  async getProfileById(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    return { id: user.id, username: user.username, role: user.role };
  }
}
