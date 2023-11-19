import { ActionTokenType, PrismaClient, Role } from '@prisma/client';

import { durationToDate } from '../src/helpers';
import { SetupStep } from '../src/setup/setup-step.enum';

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

  // Create setup
  await prisma.setup.create({
    data: {
      id: 1,
      step: SetupStep.COMPLETED,
      completed: true,
    },
  });

  // Create primary user
  const user = await prisma.user.create({
    data: {
      id: 'clp1ko4hb000008l61vrphvpf',
      name: 'Richard Solomou',
      displayName: 'Richard',
      email: process.env.SEED_USER_EMAIL,
      isEmailVerified: true,
      password: { create: { hash: process.env.SEED_USER_PASSWORD } },
    },
  });

  // Create secondary user
  const secondaryUser = await prisma.user.create({
    data: {
      id: 'clp1ko4hb000008l61vrphvpg',
      name: 'Richard Solomou',
      displayName: 'Richard',
      email: process.env.SEED_USER_EMAIL.replace('@', '+1@'),
      isEmailVerified: true,
      password: { create: { hash: process.env.SEED_USER_PASSWORD } },
    },
  });

  // Create campaign
  const campaign = await prisma.campaign.create({
    data: {
      id: 'clp1kob2u000108l656m44frh',
      name: "Richard's Campaign",
      createdById: user.id,
      memberships: {
        create: {
          userId: user.id,
          role: Role.GAME_MASTER,
        },
      },
      invites: {
        create: {
          type: ActionTokenType.INVITE,
          email: secondaryUser.email,
          userId: secondaryUser.id,
          expiresAt: durationToDate('7d'),
        },
      },
    },
  });

  // Create map media
  const mapMedia = await prisma.media.create({
    data: {
      name: 'map.webp',
      url: 'https://cdn.tarrasque.app/sample/map/original.webp',
      thumbnailUrl: 'https://cdn.tarrasque.app/sample/map/thumbnail.webp',
      width: 2100,
      height: 1400,
      size: 1038666,
      format: 'image/webp',
      extension: 'webp',
      createdBy: { connect: { id: user.id } },
    },
  });

  // Create map
  const map = await prisma.map.create({
    data: {
      id: 'clp1kob2u000208l6d1v2q2j6',
      name: "Richard's Map",
      media: { connect: { id: mapMedia.id } },
      selectedMediaId: mapMedia.id,
      campaign: { connect: { id: campaign.id } },
      createdBy: { connect: { id: user.id } },
    },
  });

  // Create character media
  const characterMedia = await prisma.media.create({
    data: {
      name: 'Wolf',
      url: 'https://cdn.tarrasque.app/sample/token/original.webp',
      thumbnailUrl: 'https://cdn.tarrasque.app/sample/token/thumbnail.webp',
      width: 280,
      height: 280,
      size: 15814,
      format: 'image/webp',
      extension: 'webp',
      createdBy: { connect: { id: user.id } },
    },
  });

  // Create character
  const character = await prisma.character.create({
    data: {
      id: 'clp1kob2u000308l6jx3d6p1p',
      name: 'Wolf',
      media: { connect: { id: characterMedia.id } },
      selectedMediaId: characterMedia.id,
      createdBy: { connect: { id: user.id } },
      campaign: { connect: { id: campaign.id } },
    },
  });

  // Create token
  await prisma.token.create({
    data: {
      id: 'clp1kob2u000408l6x7s6h9q3',
      width: 280,
      height: 280,
      x: 70,
      y: 70,
      createdBy: { connect: { id: user.id } },
      map: { connect: { id: map.id } },
      character: { connect: { id: character.id } },
    },
  });
}
main();
