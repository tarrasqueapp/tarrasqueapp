import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User as UserModel } from '@prisma/client';

import { UsersService } from './users.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  async getUsers() {
    return this.usersService.users({});
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get specific user' })
  async getUserById(@Param('id') id: string) {
    return this.usersService.user({ id });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser({ id });
  }

  @Post('')
  async signupUser(@Body() userData: { name: string; email: string; password: string }): Promise<UserModel> {
    return this.usersService.createUser(userData);
  }
}
