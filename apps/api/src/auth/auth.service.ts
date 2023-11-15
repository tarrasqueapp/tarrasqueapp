import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { Response } from 'express';

import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name);

  constructor(private usersService: UsersService) {}

  /**
   * Set access token cookie
   * @param res - The response object
   * @param accessToken - The access token
   */
  setCookies(res: Response, accessToken: string): void {
    // Clear previous cookies before setting
    this.clearCookies(res);

    const cookieName = 'Access';

    // Set the cookie
    res.cookie(cookieName, accessToken, {
      httpOnly: true,
      signed: true,
      path: '/',
      sameSite: 'lax',
    });
  }

  /**
   * Delete access token cookie
   * @param res - The response object
   */
  clearCookies(res: Response): void {
    // Set the cookie name based on the environment
    const cookieName = 'Access';

    // Clear the cookie
    res.clearCookie(cookieName, {
      httpOnly: true,
      signed: true,
      path: '/',
      sameSite: 'lax',
    });
  }

  /**
   * Log in user and return the user
   * @param email - The user's email
   * @param password - The user's password
   * @returns The user with the hashed password
   */
  async signIn(email: string, password: string): Promise<UserEntity> {
    this.logger.verbose(`📂 Logging in user "${email}"`);

    // Get the user
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Throw an error if the password is wrong
    if (!user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }
    await this.verifyPassword(user.password, password);
    this.logger.debug(`✅️ Logged in user "${email}"`);

    // Return the user without the excluded fields
    return await this.usersService.getUserById(user.id);
  }

  /**
   * Verify the password against the hashed password
   * @param hashedPassword - The hashed password
   * @param password - The password
   */
  async verifyPassword(hashedPassword: string, password: string): Promise<void> {
    this.logger.verbose(`📂 Verifying password`);
    try {
      // Check if the password is correct
      const passwordMatches = await argon2.verify(hashedPassword, password);
      if (!passwordMatches) {
        this.logger.error(`🚨 Failed to verify password`);
        throw new UnauthorizedException('Invalid email or password');
      }
      this.logger.debug(`✅️ Verified password`);
    } catch (error) {
      this.logger.error(`🚨 Failed to verify password`, error);
      throw new UnauthorizedException('Invalid email or password');
    }
  }
}
