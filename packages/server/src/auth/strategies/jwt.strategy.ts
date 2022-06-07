import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { config } from '../../config';
import { UserEntity } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { TokenPayload } from '../tokenPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.signedCookies?.[config.JWT_ACCESS_TOKEN_NAME];
        },
      ]),
      secretOrKey: config.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  /**
   * Get the user from the token
   */
  validate(payload: TokenPayload): Promise<UserEntity> {
    return this.userService.getUserById(payload.userId);
  }
}
