import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { UserEntity } from '../../users/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  /**
   * Get the user from the email and password
   * @param email - The user's email
   * @param password - The user's password
   * @returns The user
   */
  validate(email: string, password: string): Promise<UserEntity> {
    return this.authService.signIn(email.toLowerCase(), password);
  }
}
