import { Injectable, NotFoundException } from '@nestjs/common';
import { Map, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MapsService {
  constructor(private prisma: PrismaService) {}

  async map(mapWhereUniqueInput: Prisma.MapWhereUniqueInput): Promise<Map | null> {
    try {
      return await this.prisma.map.findUnique({
        where: mapWhereUniqueInput,
        include: {
          tokens: true,
          media: true,
          campaign: true,
        },
        rejectOnNotFound: true,
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async maps(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MapWhereUniqueInput;
    where?: Prisma.MapWhereInput;
    orderBy?: Prisma.MapOrderByWithRelationInput;
  }): Promise<Map[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.map.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        media: true,
        campaign: true,
      },
    });
  }

  async createMap(data: Prisma.MapCreateInput) {
    return this.prisma.map.create({ data });
  }

  async updateMap(params: { where: Prisma.MapWhereUniqueInput; data: Prisma.MapUpdateInput }) {
    const { data, where } = params;
    return this.prisma.map.update({ data, where });
  }

  async deleteMap(where: Prisma.MapWhereUniqueInput) {
    return this.prisma.map.delete({ where });
  }
}
