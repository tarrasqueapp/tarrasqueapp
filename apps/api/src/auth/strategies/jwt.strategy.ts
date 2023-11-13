import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { config } from '@tarrasque/common';

import { TokenPayload } from '../../action-tokens/token-payload.interface';
import { UserEntity } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookieName = 'Access';

          // Get the cookie
          return request?.signedCookies?.[cookieName];
        },
      ]),
      secretOrKey: config.JWT_SECRET,
    });
  }

  /**
   * Get the user from the token
   * @param payload - The token payload
   * @returns The user
   */
  validate(payload: TokenPayload): Promise<UserEntity> {
    return this.userService.getUserById(payload.userId);
  }
}
