import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  // Delete existing data
  await prisma.$transaction([
    prisma.setup.deleteMany(),
    prisma.media.deleteMany(),
    prisma.user.deleteMany(),
    prisma.actionToken.deleteMany(),
    prisma.campaign.deleteMany(),
    prisma.membership.deleteMany(),
    prisma.map.deleteMany(),
    prisma.character.deleteMany(),
    prisma.token.deleteMany(),
  ]);
}
main();
