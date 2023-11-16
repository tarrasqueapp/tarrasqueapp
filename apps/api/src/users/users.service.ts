import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from 'nestjs-prisma';

import { MembershipsGateway } from '../campaigns/modules/memberships/memberships.gateway';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersGateway } from './users.gateway';

export function serializeUser(user: UserEntity) {
  if (!user) return null;

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

  constructor(
    private prisma: PrismaService,
    private usersGateway: UsersGateway,
    private membershipsGateway: MembershipsGateway,
  ) {}

  /**
   * Get a user that matches the given id
   * @param userId - The user's id
   * @returns User
   */
  async getUserById(userId: string): Promise<UserEntity> {
    this.logger.verbose(`📂 Getting user "${userId}"`);
    try {
      // Get the user
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        include: { avatar: true, memberships: true },
      });
      this.logger.debug(`✅️ Found user "${userId}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`, error);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Get a user that matches the given email
   * @param email - The user's email
   * @returns User
   */
  async getUserByEmail(email: string): Promise<UserEntity> {
    this.logger.verbose(`📂 Getting user with email "${email}"`);
    try {
      // Get the user
      const user = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { avatar: true, memberships: { include: { campaign: true } } },
      });

      if (!user) {
        this.logger.debug(`🚨 User with email "${email}" not found`);
        return null;
      }

      this.logger.debug(`✅️ Found user "${user.id}" with email "${email}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User with email "${email}" not found`, error);
      throw new InternalServerErrorException(error.message);
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
      // Create the user
      const user = await this.prisma.user.create({
        data: {
          ...data,
          displayName: data.name.split(' ')[0],
          password: await this.hashPassword(data.password),
        },
        include: {
          avatar: true,
          memberships: { include: { campaign: true } },
        },
      });
      this.logger.debug(`✅️ Created user "${data.email}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${data.email}" already exists`, error);
      throw new ConflictException('User alreadfy exists');
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
          ...data,
          ...(data.password && { password: await this.hashPassword(data.password) }),
        },
        include: {
          avatar: true,
          memberships: { include: { campaign: true } },
        },
      });

      this.usersGateway.updateUser(user);
      user.memberships.forEach((membership) => {
        this.membershipsGateway.updateMembership({ ...membership, user });
      });

      this.logger.debug(`✅️ Updated user "${userId}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`, error);
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
      this.usersGateway.deleteUser(user);
      this.logger.debug(`✅️ Deleted user "${userId}"`);
      return user;
    } catch (error) {
      this.logger.error(`🚨 User "${userId}" not found`, error);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Hash a password
   * @param password - The password to hash
   * @returns The hashed password
   */
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }
}
