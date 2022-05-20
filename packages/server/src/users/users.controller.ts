import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { ConnectUserDto } from './dto/connect-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { RoleGuard } from './guards/role.guard';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get all users
   */
  @Get()
  @UseGuards(RoleGuard(Role.ADMIN))
  @ApiBearerAuth()
  @ApiOkResponse({ type: [UserEntity] })
  async getUsers(): Promise<UserEntity[]> {
    return await this.usersService.getUsers();
  }

  /**
   * Get a user by their id
   */
  @Get(':id')
  @UseGuards(RoleGuard(Role.ADMIN))
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async getUserById(@Param() { id }: ConnectUserDto): Promise<UserEntity> {
    return await this.usersService.getUserById(id);
  }

  /**
   * Create a new user
   */
  @Post()
  @UseGuards(RoleGuard(Role.ADMIN))
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async createUser(@Body() data: CreateUserDto): Promise<UserEntity> {
    return await this.usersService.createUser(data);
  }

  /**
   * Update a user
   */
  @Put(':id')
  @UseGuards(RoleGuard(Role.ADMIN))
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async updateUser(@Param() { id }: ConnectUserDto, @Body() data: UpdateUserDto): Promise<UserEntity> {
    return await this.usersService.updateUser(id, data);
  }

  /**
   * Delete a user
   */
  @Delete(':id')
  @UseGuards(RoleGuard(Role.ADMIN))
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async deleteUser(@Param() { id }: ConnectUserDto): Promise<UserEntity> {
    return await this.usersService.deleteUser(id);
  }
}
