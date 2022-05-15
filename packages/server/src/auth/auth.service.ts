import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { TokenPayload } from './tokenPayload.interface';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name);

  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  /**
   * Log in user and return the user with the hashed password.
   * @param email The user's email
   * @param password The user's password
   * @returns The user with the hashed password and the hashed refresh token
   */
  async login(email: string, password: string): Promise<UserEntity> {
    this.logger.verbose(`📂 Logging in user "${email}"`);
    // Get the user
    const userWithExcludedFields = await this.usersService.getUserByEmailWithExcludedFields(email);
    // Throw an error if the password is wrong
    await this.verifyPassword(userWithExcludedFields.password, password);
    this.logger.debug(`✅️ Logged in user "${email}"`);
    // Return the user without the excluded fields
    return await this.usersService.getUserById(userWithExcludedFields.id);
  }

  /**
   * Verify the password against the hashed password
   * @param hashedPassword The hashed password
   * @param password The password
   */
  async verifyPassword(hashedPassword: string, password: string): Promise<void> {
    this.logger.verbose(`📂 Verifying password`);
    try {
      // Check if the password is correct
      const passwordMatches = await argon2.verify(hashedPassword, password);
      if (!passwordMatches) {
        throw new UnauthorizedException('Invalid email or password');
      }
      this.logger.debug(`✅️ Verified password`);
    } catch (error) {
      this.logger.error(`🚨 User failed to verify password`);
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  /**
   * Sign a JWT access token for the user
   * @param userId The user's ID
   * @returns The JWT access token
   */
  public generateAccessToken(userId: string) {
    this.logger.verbose(`📂 Generating access token`);
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });
    this.logger.debug(`✅️ Generated access token`);
    return token;
  }

  /**
   * Sign a JWT refresh token for the user
   * @param userId The user's ID
   * @returns The JWT refresh token
   */
  public generateRefreshToken(userId: string) {
    this.logger.verbose(`📂 Generating refresh token`);
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
    this.logger.debug(`✅️ Generated refresh token`);
    return token;
  }

  /**
   * Get the user from the JWT access token
   * @param token The JWT access token
   * @returns The user
   */
  public async getUserFromToken(token: string) {
    const payload: TokenPayload = this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_TOKEN_SECRET });
    if (payload.userId) {
      return this.usersService.getUserById(payload.userId);
    }
  }
}
