import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { config } from '../config';

@Injectable()
export class GenericTokensService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generate a new generic token
   * @param payload - The token's payload
   * @returns The generated token
   */
  generateToken(payload: Record<string, string>): string {
    return this.jwtService.sign(payload, {
      secret: config.JWT_GENERIC_TOKEN_SECRET,
      expiresIn: config.JWT_GENERIC_TOKEN_EXPIRATION_TIME,
    });
  }

  /**
   * Decode a generic token
   * @param token - The token to decode
   * @returns The decoded token
   */
  decodeToken(token: string): Record<string, string> {
    return this.jwtService.verify(token, {
      secret: config.JWT_GENERIC_TOKEN_SECRET,
    });
  }
}
