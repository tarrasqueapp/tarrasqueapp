import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserEntity } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { TokenPayload } from '../tokenPayload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.signedCookies?.[process.env.JWT_REFRESH_TOKEN_NAME];
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  /**
   * Validate the refresh token and return the user
   */
  async validate(request: Request, payload: TokenPayload): Promise<UserEntity> {
    const refreshToken = request.signedCookies?.[process.env.JWT_REFRESH_TOKEN_NAME];
    return this.userService.getUserIfRefreshTokenMatches(payload.userId, refreshToken);
  }
}
