import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import cookieParser from 'cookie-parser';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { config } from '@tarrasque/common';

import { TokenPayload } from '../../action-tokens/token-payload.interface';
import { UserEntity } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtWsStrategy extends PassportStrategy(Strategy, 'jwt-ws') {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookies = request.headers.cookie?.split('; ');

          const cookieName = 'Access';

          // Get the cookie
          const accessCookie = cookies?.find((cookie: string) => cookie.startsWith(`${cookieName}=`));
          const cookie = accessCookie?.split('=')[1];

          if (!cookie) {
            return null;
          }

          const accessToken = cookieParser.signedCookie(decodeURIComponent(cookie), config.COOKIE_SECRET) as string;

          return accessToken;
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
