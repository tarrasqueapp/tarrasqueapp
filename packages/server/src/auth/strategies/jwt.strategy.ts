import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { config } from '../../config';
import { UserEntity } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { TokenPayload } from '../tokenPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.signedCookies?.[config.jwtAccessTokenName];
        },
      ]),
      secretOrKey: config.jwtAccessTokenSecret,
    });
  }

  /**
   * Get the user from the token
   */
  async validate(payload: TokenPayload): Promise<UserEntity> {
    return this.userService.getUserById(payload.userId);
  }
}
