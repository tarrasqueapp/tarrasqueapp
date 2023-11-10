import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from 'nestjs-prisma';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

export function serializeUser(user: User) {
  return Object.assign(user, {
    // Hide password before sending to client
    toJSON: () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return rest;
    },
  });
}

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
      const users = await this.prisma.user.findMany({ include: { avatar: true } });
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
      const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, include: { avatar: true } });
      this.logger.debug(`✅️ Found user "${userId}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Get a user that matches the given email (without their password)
   * @param email - The user's email
   * @returns User
   */
  async getUserByEmail(email: string): Promise<UserEntity> {
    this.logger.verbose(`📂 Getting user with email "${email}"`);
    try {
      // Get the user
      const user = await this.prisma.user.findUniqueOrThrow({ where: { email }, include: { avatar: true } });
      this.logger.debug(`✅️ Found user "${user.id}" with email "${email}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User with email "${email}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Get a user that matches the given id (without their password)
   * @param userId - The user's id
   * @returns User
   */
  async getUserByIdWithExcludedFields(userId: string): Promise<UserEntity> {
    this.logger.verbose(`📂 Getting user "${userId}"`);
    try {
      // Get the user
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
      });
      this.logger.debug(`✅️ Found user "${userId}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Get a user that matches the given email (with their password)
   * @param email - The user's email
   * @returns User
   */
  async getUserByEmailWithExcludedFields(email: string): Promise<UserEntity> {
    this.logger.verbose(`📂 Getting user with email "${email}"`);
    try {
      // Get the user
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { email },
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
        include: { avatar: true },
      });
      this.logger.debug(`✅️ Created user "${data.email}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${data.email}" already exists`, error);
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
          isEmailVerified: data.isEmailVerified,
          ...(data.password && { password: await argon2.hash(data.password) }),
        },
        include: { avatar: true },
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
      const user = await this.prisma.user.delete({ where: { id: userId }, include: { avatar: true } });
      this.logger.debug(`✅️ Deleted user "${userId}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`);
      throw new NotFoundException(error.message);
    }
  }
}
