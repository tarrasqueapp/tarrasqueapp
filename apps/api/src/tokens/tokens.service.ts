import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { TokenBaseEntity } from './entities/token-base.entity';
import { TokenEntity } from './entities/token.entity';

@Injectable()
export class TokensService {
  private logger: Logger = new Logger(TokensService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get all tokens for a map
   * @param mapId - The map id
   * @returns The tokens
   *
   */
  async getTokens(tokenIds: string[]): Promise<TokenEntity[]> {
    this.logger.verbose(`📂 Getting tokens"`);
    try {
      // Get the tokens
      const tokens = await this.prisma.token.findMany({
        where: { id: { in: tokenIds } },
        include: {
          playerCharacter: { include: { controlledBy: true, media: true } },
          nonPlayerCharacter: { include: { controlledBy: true, media: true } },
        },
      });
      this.logger.verbose(`📂 Found ${tokens.length} tokens"`);
      return tokens;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Get all tokens for a map
   * @param mapId - The map id
   * @returns A map's tokens
   */
  async getMapTokens(mapId: string): Promise<TokenEntity[]> {
    this.logger.verbose(`📂 Getting tokens for map "${mapId}"`);
    try {
      // Get the tokens
      const tokens = await this.prisma.token.findMany({
        where: { mapId },
        include: {
          playerCharacter: { include: { controlledBy: true, media: true } },
          nonPlayerCharacter: { include: { controlledBy: true, media: true } },
        },
      });
      this.logger.verbose(`📂 Found ${tokens.length} tokens for map "${mapId}"`);
      return tokens;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Create a token on a map
   * @param data - The token data
   * @param mapId - The map id
   * @param createdById - The user id
   * @returns The created token
   */
  async createToken(data: CreateTokenDto, mapId: string, createdById: string): Promise<TokenEntity> {
    this.logger.verbose(`📂 Creating token at ${data.x}x${data.y} on map "${mapId}"`);
    try {
      // Create the token
      const token = await this.prisma.token.create({
        data: { ...data, mapId, createdById },
        include: {
          playerCharacter: { include: { controlledBy: true, media: true } },
          nonPlayerCharacter: { include: { controlledBy: true, media: true } },
        },
      });
      this.logger.debug(`✅️ Created token "${token.id}"`);
      return token;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Create tokens on a map
   * @param data - The token data
   * @param mapId - The map id
   * @param createdById - The user id
   * @returns The created tokens
   */
  createTokens(data: CreateTokenDto[], mapId: string, createdById: string): Promise<TokenEntity[]> {
    const promises = data.map((token) => this.createToken(token, mapId, createdById));
    return Promise.all(promises);
  }

  /**
   * Update a token on a map
   * @param tokenId - The token id
   * @param data - The token data
   * @returns The updated token
   */
  async updateToken(tokenId: string, data: UpdateTokenDto): Promise<TokenBaseEntity> {
    this.logger.verbose(`📂 Updating token "${tokenId}"`);
    try {
      // Update the token
      const token = await this.prisma.token.update({ where: { id: tokenId }, data });
      this.logger.debug(`✅️ Updated token "${token.id}"`);
      return token;
    } catch (error) {
      this.logger.error(`🚨 Token "${tokenId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Update tokens on a map
   * @param data - The token data
   * @returns The updated tokens
   */
  updateTokens(data: UpdateTokenDto[]): Promise<TokenBaseEntity[]> {
    const promises = data.map((token) => this.updateToken(token.id, token));
    return Promise.all(promises);
  }

  /**
   * Delete a token on a map
   * @param tokenId - The token id
   * @returns The deleted token
   */
  async deleteToken(tokenId: string): Promise<TokenBaseEntity> {
    this.logger.verbose(`📂 Deleting token "${tokenId}"`);
    try {
      // Delete the token
      const token = await this.prisma.token.delete({ where: { id: tokenId } });
      this.logger.debug(`✅️ Deleted token "${token.id}"`);
      return token;
    } catch (error) {
      this.logger.error(`🚨 Token "${tokenId}" not found`);
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Delete tokens on a map
   * @param tokenIds - The token ids
   * @returns The deleted tokens
   */
  deleteTokens(tokenIds: string[]): Promise<TokenBaseEntity[]> {
    const promises = tokenIds.map((tokenId) => this.deleteToken(tokenId));
    return Promise.all(promises);
  }
}
