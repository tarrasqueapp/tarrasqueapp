import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import { excludeFields } from '../helpers';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserWithPasswordEntity } from './entities/user-with-password.entity';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get the fields that should be returned without the password
   */
  get fieldsWithoutPassword() {
    return excludeFields(Prisma.UserScalarFieldEnum, ['password']);
  }

  /**
   * Get all users that match the given criteria (without their password)
   */
  async getUsers(): Promise<UserEntity[]> {
    this.logger.verbose(`📂 Getting users`);
    try {
      // Get the users
      const users = await this.prisma.user.findMany({ select: this.fieldsWithoutPassword });
      this.logger.verbose(`✅️ Found ${users.length} users`);
      return users;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Get a user that matches the given criteria (without their password)
   */
  async getUser(userId: string): Promise<UserEntity> {
    this.logger.verbose(`📂 Getting user "${userId}"`);
    try {
      // Get the user
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: this.fieldsWithoutPassword,
        rejectOnNotFound: true,
      });
      this.logger.verbose(`✅️ Found user "${userId}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Get a user that matches the given criteria (with their password)
   */
  async getUserWithPassword(userId: string): Promise<UserWithPasswordEntity> {
    this.logger.verbose(`📂 Getting user "${userId}"`);
    try {
      // Get the user
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        rejectOnNotFound: true,
      });
      this.logger.verbose(`✅️ Found user "${userId}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Create a new user
   */
  async createUser(data: CreateUserDto): Promise<UserEntity> {
    this.logger.verbose(`📂 Creating user "${data.email}"`);
    try {
      // Create the user
      const user = await this.prisma.user.create({ data, select: this.fieldsWithoutPassword });
      this.logger.verbose(`✅️ Created user "${data.email}"`);
      return user;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Update a user
   */
  async updateUser(userId: string, data: UpdateUserDto): Promise<UserEntity> {
    this.logger.verbose(`📂 Updating user "${userId}"`);
    try {
      // Update the user
      const user = await this.prisma.user.update({ where: { id: userId }, data, select: this.fieldsWithoutPassword });
      this.logger.verbose(`✅️ Updated user "${userId}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<UserEntity> {
    this.logger.verbose(`📂 Deleting user "${userId}"`);
    try {
      // Delete the user
      const user = await this.prisma.user.delete({ where: { id: userId }, select: this.fieldsWithoutPassword });
      this.logger.verbose(`✅️ Deleted user "${userId}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`);
      throw new NotFoundException(error.message);
    }
  }
}
