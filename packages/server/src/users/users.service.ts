import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from 'nestjs-prisma';

import { excludeFields } from '../helpers';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserWithExcludedFieldsEntity } from './entities/user-with-excluded-fields.entity';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get the fields that should be returned when querying users
   * @returns User fields withouth password and refresh token
   */
  get includedFields() {
    return excludeFields(Prisma.UserScalarFieldEnum, ['password', 'refreshToken']);
  }

  /**
   * Get all users (without their password or refresh token)
   * @returns Users
   */
  async getUsers(): Promise<UserEntity[]> {
    this.logger.verbose(`📂 Getting users`);
    try {
      // Get the users
      const users = await this.prisma.user.findMany({ select: this.includedFields });
      this.logger.debug(`✅️ Found ${users.length} users`);
      return users;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Get user count
   * @returns User count
   */
  async getUserCount(): Promise<number> {
    this.logger.verbose(`📂 Getting user count`);
    try {
      // Get the user count
      const count = await this.prisma.user.count();
      this.logger.debug(`✅️ Found ${count} users`);
      return count;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Get a user that matches the given id (without their password or refresh token)
   * @param userId The user's id
   * @returns User
   */
  async getUserById(userId: string): Promise<UserEntity> {
    this.logger.verbose(`📂 Getting user "${userId}"`);
    try {
      // Get the user
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: this.includedFields,
        rejectOnNotFound: true,
      });
      this.logger.debug(`✅️ Found user "${userId}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Get a user that matches the given id (without their password or refresh token)
   * @param userId The user's id
   * @returns User
   */
  async getUserByIdWithExcludedFields(userId: string): Promise<UserWithExcludedFieldsEntity> {
    this.logger.verbose(`📂 Getting user "${userId}"`);
    try {
      // Get the user
      const user = await this.prisma.user.findUnique({ where: { id: userId }, rejectOnNotFound: true });
      this.logger.debug(`✅️ Found user "${userId}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Get a user that matches the given email (with their password and refresh token)
   * @param email The user's email
   * @returns User
   */
  async getUserByEmailWithExcludedFields(email: string): Promise<UserWithExcludedFieldsEntity> {
    this.logger.verbose(`📂 Getting user with email "${email}"`);
    try {
      // Get the user
      const user = await this.prisma.user.findUnique({ where: { email }, rejectOnNotFound: true });
      this.logger.debug(`✅️ Found user "${user.id}" with email "${email}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User with email "${email}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Create a new user
   * @param data The user's data
   * @returns The created user
   */
  async createUser(data: CreateUserDto): Promise<UserEntity> {
    this.logger.verbose(`📂 Creating user "${data.email}"`);
    try {
      // Create the user
      const user = await this.prisma.user.create({ data, select: this.includedFields });
      this.logger.debug(`✅️ Created user "${data.email}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${data.email}" already exists`);
      throw new ConflictException('User already exists');
    }
  }

  /**
   * Update a user
   * @param userId The user's id
   * @param data The user's data
   * @returns The updated user
   */
  async updateUser(userId: string, data: UpdateUserDto): Promise<UserEntity> {
    this.logger.verbose(`📂 Updating user "${userId}"`);
    try {
      // Update the user
      const user = await this.prisma.user.update({ where: { id: userId }, data, select: this.includedFields });
      this.logger.debug(`✅️ Updated user "${userId}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Delete a user
   * @param userId The user's id
   * @returns The deleted user
   */
  async deleteUser(userId: string): Promise<UserEntity> {
    this.logger.verbose(`📂 Deleting user "${userId}"`);
    try {
      // Delete the user
      const user = await this.prisma.user.delete({ where: { id: userId }, select: this.includedFields });
      this.logger.debug(`✅️ Deleted user "${userId}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Set the refresh token for a user
   * @param userId The user's id
   * @param refreshToken The refresh token
   */
  async setRefreshToken(userId: string, refreshToken: string): Promise<void> {
    this.logger.verbose(`📂 Setting refresh token for user "${userId}"`);
    // Hash the refresh token
    const hashedRefreshToken = await argon2.hash(refreshToken);
    try {
      // Update the user
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: hashedRefreshToken },
        select: this.includedFields,
      });
      this.logger.debug(`✅️ Removed refresh token for user "${userId}"`);
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Remove the refresh token from a user
   * @param userId The user's id
   * @returns The user
   */
  async removeRefreshToken(userId: string): Promise<UserEntity> {
    this.logger.verbose(`📂 Removing refresh token for user "${userId}"`);
    try {
      // Update the user
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
        select: this.includedFields,
      });
      this.logger.debug(`✅️ Removed refresh token for user "${userId}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Get user from refresh token
   * @param userId The user's id
   * @param refreshToken The refresh token
   * @returns The user
   */
  async getUserIfRefreshTokenMatches(userId: string, refreshToken: string) {
    // Get the user
    const userWithExcludedFields = await this.getUserByIdWithExcludedFields(userId);
    // Check if the refresh token matches
    const refreshTokenMatches = await argon2.verify(userWithExcludedFields.refreshToken, refreshToken);
    // Return the user if the refresh token matches
    if (refreshTokenMatches) {
      return await this.getUserById(userId);
    }
  }
}
