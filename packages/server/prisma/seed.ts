import { PrismaClient, Role } from '@prisma/client';
import argon2 from 'argon2';
import cuid from 'cuid';

import { SetupStep } from '../src/setup/setup-step.enum';

const prisma = new PrismaClient();

async function main() {
  try {
    console.debug('📂 Deleting all movement types...');
    await prisma.movement.deleteMany({});

    console.debug('📂 Deleting all hit points...');
    await prisma.hitPoints.deleteMany({});

    console.debug('📂 Deleting all armor classes...');
    await prisma.armorClass.deleteMany({});

    console.debug('📂 Deleting all senses...');
    await prisma.senses.deleteMany({});

    console.debug('📂 Deleting all abilities...');
    await prisma.ability.deleteMany({});

    console.debug('📂 Deleting all skills...');
    await prisma.skill.deleteMany({});

    console.debug('📂 Deleting all currencies...');
    await prisma.currencies.deleteMany({});

    console.debug('📂 Deleting all media...');
    await prisma.media.deleteMany({});

    console.debug('📂 Deleting all player characters...');
    await prisma.playerCharacter.deleteMany({});

    console.debug('📂 Deleting all non-player characters...');
    await prisma.nonPlayerCharacter.deleteMany({});

    console.debug('📂 Deleting all tokens...');
    await prisma.token.deleteMany({});

    console.debug('📂 Deleting all maps...');
    await prisma.map.deleteMany({});

    console.debug('📂 Deleting all campaigns...');
    await prisma.campaign.deleteMany({});

    console.debug('📂 Deleting all refresh tokens...');
    await prisma.refreshToken.deleteMany({});

    console.debug('📂 Deleting all plugins...');
    await prisma.plugin.deleteMany({});

    console.debug('📂 Deleting all users...');
    await prisma.user.deleteMany({});

    console.debug('📂 Deleting all setup data...');
    await prisma.setup.deleteMany({});

    console.debug('✅️ All data deleted.');

    console.debug('📂 Creating new user...');
    const userId = cuid();
    await prisma.user.create({
      data: {
        id: userId,
        name: 'Richard',
        email: 'richard@tarrasque.app',
        roles: [Role.USER, Role.ADMIN],
        password: await argon2.hash('password'),
      },
    });

    console.debug('📂 Creating new campaign...');
    const campaignId = cuid();
    await prisma.campaign.create({
      data: {
        id: campaignId,
        name: 'Example Campaign',
        createdBy: { connect: { id: userId } },
      },
    });

    console.debug('📂 Creating new map...');
    const mapId = cuid();
    await prisma.map.create({
      data: {
        id: mapId,
        name: 'Example Map',
        media: {
          create: {
            url: 'https://cdn.tarrasque.app/sample/map.webp',
            thumbnailUrl: 'https://cdn.tarrasque.app/sample/map.webp',
            width: 2450,
            height: 1400,
            size: 1360000,
            format: 'image/webp',
            extension: 'webp',
            createdBy: { connect: { id: userId } },
          },
        },
        campaign: { connect: { id: campaignId } },
        createdBy: { connect: { id: userId } },
      },
    });

    console.debug('📂 Creating new player character...');
    const playerCharacterId = cuid();
    await prisma.playerCharacter.create({
      data: {
        id: playerCharacterId,
        name: 'Example Player Character',
        armorClass: { create: { description: 'Natural armor' } },
        hitPoints: { create: {} },
        movement: { create: {} },
        senses: { create: { darkvision: 60 } },
        currencies: { create: { gold: 30, silver: 10 } },
        media: {
          create: {
            url: 'https://cdn.tarrasque.app/sample/token.webp',
            thumbnailUrl: 'https://cdn.tarrasque.app/sample/token.webp',
            width: 280,
            height: 280,
            size: 15440,
            format: 'image/webp',
            extension: 'webp',
            createdBy: { connect: { id: userId } },
          },
        },
        abilities: {
          create: [
            { name: 'Strength', shortName: 'STR', skills: { create: [{ name: 'Athletics' }] } },
            {
              name: 'Dexterity',
              shortName: 'DEX',
              skills: {
                create: [{ name: 'Acrobatics' }, { name: 'Sleight of Hand' }, { name: 'Stealth' }],
              },
            },
            { name: 'Constitution', shortName: 'CON' },
            {
              name: 'Intelligence',
              shortName: 'INT',
              skills: {
                create: [
                  { name: 'Arcana' },
                  { name: 'History' },
                  { name: 'Investigation' },
                  { name: 'Nature' },
                  { name: 'Religion' },
                ],
              },
            },
            {
              name: 'Wisdom',
              shortName: 'WIS',
              skills: {
                create: [
                  { name: 'Animal Handling' },
                  { name: 'Insight' },
                  { name: 'Medicine' },
                  { name: 'Perception' },
                  { name: 'Survival' },
                ],
              },
            },
            {
              name: 'Charisma',
              shortName: 'CHA',
              skills: {
                create: [
                  { name: 'Deception' },
                  { name: 'Intimidation' },
                  { name: 'Performance' },
                  { name: 'Persuasion' },
                ],
              },
            },
          ],
        },
        createdBy: { connect: { id: userId } },
        campaign: { connect: { id: campaignId } },
      },
    });

    console.debug('📂 Creating new token...');
    await prisma.token.create({
      data: {
        width: 40,
        height: 40,
        x: 80,
        y: 80,
        createdBy: { connect: { id: userId } },
        map: { connect: { id: mapId } },
        playerCharacter: { connect: { id: playerCharacterId } },
      },
    });

    console.debug('📂 Creating new plugin...');
    await prisma.plugin.create({
      data: {
        name: 'Example Plugin',
        url: 'https://github.com/tarrasqueapp/tarrasque-example-plugin',
      },
    });

    console.debug('📂 Creating new setup data...');
    await prisma.setup.create({
      data: {
        id: 1,
        step: SetupStep.COMPLETED,
        completed: true,
      },
    });

    console.debug('✅️ New data created.');
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
main();
