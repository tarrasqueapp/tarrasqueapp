import { Injectable } from '@nestjs/common';
import { Prisma, Token } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TokensService {
  constructor(private prisma: PrismaService) {}

  async token(tokenWhereUniqueInput: Prisma.TokenWhereUniqueInput) {
    return this.prisma.token.findUnique({ where: tokenWhereUniqueInput });
  }

  async tokens(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TokenWhereUniqueInput;
    where?: Prisma.TokenWhereInput;
    orderBy?: Prisma.TokenOrderByWithRelationInput;
  }): Promise<Token[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.token.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { playerCharacter: { include: { media: true } }, nonPlayerCharacter: { include: { media: true } } },
    });
  }

  async createToken(data: Prisma.TokenCreateInput) {
    return this.prisma.token.create({ data });
  }

  async updateToken(params: { where: Prisma.TokenWhereUniqueInput; data: Prisma.TokenUpdateInput }) {
    const { data, where } = params;
    return this.prisma.token.update({ data, where });
  }

  async deleteToken(where: Prisma.TokenWhereUniqueInput) {
    return this.prisma.token.delete({ where });
  }
}
