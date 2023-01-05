import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { config } from '../../config';
import { UserEntity } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { TokenPayload } from '../token-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.signedCookies?.Refresh;
        },
      ]),
      secretOrKey: config.JWT_REFRESH_TOKEN_SECRET,
      ignoreExpiration: true,
      passReqToCallback: true,
    });
  }

  /**
   * Validate the refresh token and return the user
   */
  validate(request: Request, payload: TokenPayload): Promise<UserEntity> {
    const refreshToken = request.signedCookies?.Refresh;
    return this.userService.getUserIfRefreshTokenMatches(payload.userId, refreshToken);
  }
}
