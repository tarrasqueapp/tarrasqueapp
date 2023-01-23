import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CharactersService {
  constructor(private prisma: PrismaService) {}
}
