import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ConnectUserDto } from './dto/connect-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get all users
   */
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, type: [UserEntity] })
  async getUsers(): Promise<UserEntity[]> {
    return await this.usersService.getUsers();
  }

  /**
   * Get a user by their id
   */
  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, type: UserEntity })
  async getUserById(@Param() { id }: ConnectUserDto): Promise<UserEntity> {
    return await this.usersService.getUser(id);
  }

  /**
   * Update a user
   */
  @Put(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, type: UserEntity })
  async updateUser(@Param() { id }: ConnectUserDto, @Body() data: UpdateUserDto): Promise<UserEntity> {
    return await this.usersService.updateUser(id, data);
  }

  /**
   * Delete a user
   */
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, type: UserEntity })
  async deleteUser(@Param() { id }: ConnectUserDto): Promise<UserEntity> {
    return await this.usersService.deleteUser(id);
  }
}
