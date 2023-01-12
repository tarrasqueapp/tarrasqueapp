import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from 'nestjs-prisma';

import { config } from '../config';
import { excludeFields, toMillisecondsFromString } from '../helpers';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserWithExcludedFieldsEntity } from './entities/user-with-excluded-fields.entity';
import { UserEntity } from './entities/user.entity';

export const USER_SAFE_FIELDS = excludeFields({ ...Prisma.UserScalarFieldEnum, avatar: 'avatar' }, ['password']);

@Injectable()
export class UsersService {
  private logger: Logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get all users (without their password)
   * @returns All users
   */
  async getUsers(): Promise<UserEntity[]> {
    this.logger.verbose(`📂 Getting users`);
    try {
      // Get the users
      const users = await this.prisma.user.findMany({ select: USER_SAFE_FIELDS });
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
   * Get a user that matches the given id (without their password)
   * @param userId - The user's id
   * @returns User
   */
  async getUserById(userId: string): Promise<UserEntity> {
    this.logger.verbose(`📂 Getting user "${userId}"`);
    try {
      // Get the user
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: USER_SAFE_FIELDS,
      });
      this.logger.debug(`✅️ Found user "${userId}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Get a user that matches the given id (without their password)
   * @param userId - The user's id
   * @returns User
   */
  async getUserByIdWithExcludedFields(userId: string): Promise<UserWithExcludedFieldsEntity> {
    this.logger.verbose(`📂 Getting user "${userId}"`);
    try {
      // Get the user
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        include: { refreshTokens: true },
      });
      this.logger.debug(`✅️ Found user "${userId}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Get a user that matches the given email (with their password and refresh token)
   * @param email - The user's email
   * @returns User
   */
  async getUserByEmailWithExcludedFields(email: string): Promise<UserWithExcludedFieldsEntity> {
    this.logger.verbose(`📂 Getting user with email "${email}"`);
    try {
      // Get the user
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { email },
        include: { refreshTokens: true },
      });
      this.logger.debug(`✅️ Found user "${user.id}" with email "${email}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User with email "${email}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Create a new user
   * @param data - The user's data
   * @returns The created user
   */
  async createUser(data: CreateUserDto): Promise<UserEntity> {
    this.logger.verbose(`📂 Creating user "${data.email}"`);
    try {
      // Hash the password
      const hashedPassword = await argon2.hash(data.password);
      // Create the user
      const user = await this.prisma.user.create({
        data: { ...data, displayName: data.name.split(' ')[0], password: hashedPassword },
        select: USER_SAFE_FIELDS,
      });
      this.logger.debug(`✅️ Created user "${data.email}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${data.email}" already exists`);
      throw new ConflictException('User already exists');
    }
  }

  /**
   * Update a user
   * @param userId - The user's id
   * @param data - The user's data
   * @returns The updated user
   */
  async updateUser(userId: string, data: UpdateUserDto): Promise<UserEntity> {
    this.logger.verbose(`📂 Updating user "${userId}"`);
    try {
      // Update the user
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          name: data.name,
          displayName: data.displayName,
          email: data.email,
          avatarId: data.avatarId,
          emailVerified: data.emailVerified,
          ...(data.password && { password: await argon2.hash(data.password) }),
        },
        select: USER_SAFE_FIELDS,
      });
      this.logger.debug(`✅️ Updated user "${userId}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Delete a user
   * @param userId - The user's id
   * @returns The deleted user
   */
  async deleteUser(userId: string): Promise<UserEntity> {
    this.logger.verbose(`📂 Deleting user "${userId}"`);
    try {
      // Delete the user
      const user = await this.prisma.user.delete({ where: { id: userId }, select: USER_SAFE_FIELDS });
      this.logger.debug(`✅️ Deleted user "${userId}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Create a new refresh token for a user
   * @param userId - The user's id
   * @param value - The refresh token's value
   * @returns The created refresh token
   */
  async createRefreshToken(userId: string, value: string): Promise<void> {
    this.logger.verbose(`📂 Creating refresh token for user "${userId}"`);
    try {
      // Create the refresh token
      await this.prisma.refreshToken.create({
        data: { value, user: { connect: { id: userId } } },
      });
      this.logger.debug(`✅️ Created refresh token for user "${userId}"`);
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Set the refresh token for a user
   * @param refreshToken - The refresh token's value
   * @param newValue - The new refresh token's value
   */
  async updateRefreshToken(refreshToken: string, newValue: string): Promise<void> {
    this.logger.verbose(`📂 Updating refresh token "${refreshToken}"`);
    // Hash the refresh token
    try {
      // Update the refresh token
      await this.prisma.refreshToken.update({
        where: { value: refreshToken },
        data: { value: newValue },
      });
      this.logger.debug(`✅️ Updated refresh token "${refreshToken}"`);
    } catch (error) {
      this.logger.error(`🚨 Refresh token "${refreshToken}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Remove the refresh token from a user
   * @param refreshToken - The refresh token
   */
  async removeRefreshToken(refreshToken: string): Promise<void> {
    this.logger.verbose(`📂 Removing refresh token "${refreshToken}"`);
    try {
      // Delete the refresh token
      await this.prisma.refreshToken.delete({ where: { value: refreshToken } });
      this.logger.debug(`✅️ Removed refresh token "${refreshToken}"`);
    } catch (error) {
      this.logger.error(`🚨 Refresh token "${refreshToken}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Get user from refresh token
   * @param userId - The user's id
   * @param refreshToken - The refresh token
   * @returns The matched user
   */
  async getUserIfRefreshTokenMatches(userId: string, refreshToken: string): Promise<UserEntity> {
    // Get the user
    const userWithExcludedFields = await this.getUserByIdWithExcludedFields(userId);
    // Check if the refresh token exists for the user
    const foundRefreshToken = userWithExcludedFields.refreshTokens.find((token) => token.value === refreshToken);
    // Throw an error if the refresh token doesn't exist
    if (!foundRefreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    // Return the user
    return await this.getUserById(userId);
  }

  /**
   * Remove old refresh tokens at midnight
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeOldRefreshTokens(): Promise<void> {
    this.logger.verbose(`📂 Removing old refresh tokens`);
    // Convert the expiration time to milliseconds
    const expirationTime = toMillisecondsFromString(config.JWT_REFRESH_TOKEN_EXPIRATION_TIME);
    // Get the expiry date by subtracting the expiration time from the current date
    const expiryDate = new Date(Date.now() - expirationTime);
    // Delete the refresh tokens
    await this.prisma.refreshToken.deleteMany({ where: { updatedAt: { lte: expiryDate } } });
    this.logger.debug(`✅️ Removed old refresh tokens`);
  }
}
