import { PrismaClient } from '@prisma/client';

import { config } from '../src/config';

const prisma = new PrismaClient();

async function main() {
  try {
    console.debug('📂 Deleting all media...');
    await prisma.media.deleteMany({});
    console.debug('📂 Deleting all tokens...');
    await prisma.token.deleteMany({});
    console.debug('📂 Deleting all maps...');
    await prisma.map.deleteMany({});
    console.debug('📂 Deleting all movement types...');
    await prisma.movement.deleteMany({});
    console.debug('📂 Deleting all hit points...');
    await prisma.hitPoints.deleteMany({});
    console.debug('📂 Deleting all armor classes...');
    await prisma.armorClass.deleteMany({});
    console.debug('📂 Deleting all senses...');
    await prisma.senses.deleteMany({});
    console.debug('📂 Deleting all skills...');
    await prisma.skill.deleteMany({});
    console.debug('📂 Deleting all abilities...');
    await prisma.ability.deleteMany({});
    console.debug('📂 Deleting all currencies...');
    await prisma.currencies.deleteMany({});
    console.debug('📂 Deleting all player characters...');
    await prisma.playerCharacter.deleteMany({});
    console.debug('📂 Deleting all non-player characters...');
    await prisma.nonPlayerCharacter.deleteMany({});
    console.debug('📂 Deleting all campaigns...');
    await prisma.campaign.deleteMany({});
    console.debug('📂 Deleting all plugins...');
    await prisma.plugin.deleteMany({});
    console.debug('📂 Deleting all users...');
    await prisma.user.deleteMany({});
    console.debug('✅️ All data deleted.');

    console.debug('📂 Creating new user...');
    await prisma.user.create({
      data: {
        id: '1',
        name: 'Example User',
        email: 'example@example.com',
        password: 'password',
      },
    });
    console.debug('📂 Creating new campaign...');
    await prisma.campaign.create({
      data: {
        id: '1',
        name: 'Example Campaign',
        createdBy: { connect: { id: '1' } },
      },
    });
    console.debug('📂 Creating new map...');
    await prisma.map.create({
      data: {
        id: '1',
        name: 'Example Map',
        media: {
          create: {
            url: `${config.basePath}/map.webp`,
            thumbnailUrl: `${config.basePath}/map.webp`,
            width: 2450,
            height: 1400,
            format: 'image/webp',
            size: 1360000,
            createdBy: { connect: { id: '1' } },
          },
        },
        campaign: { connect: { id: '1' } },
        createdBy: { connect: { id: '1' } },
      },
    });
    console.debug('📂 Creating new player character...');
    await prisma.playerCharacter.create({
      data: {
        id: '1',
        name: 'Example Player Character',
        armorClass: { create: { description: 'Natural armor' } },
        hitPoints: { create: {} },
        movement: { create: {} },
        senses: { create: { darkvision: 60 } },
        currencies: { create: { gold: 30, silver: 10 } },
        media: {
          create: {
            url: `${config.basePath}/token.webp`,
            thumbnailUrl: `${config.basePath}/token.webp`,
            width: 280,
            height: 280,
            format: 'image/webp',
            size: 15440,
            createdBy: { connect: { id: '1' } },
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
        createdBy: { connect: { id: '1' } },
        campaign: { connect: { id: '1' } },
      },
    });
    console.debug('📂 Creating new token...');
    await prisma.token.create({
      data: {
        width: 40,
        height: 40,
        x: 80,
        y: 80,
        createdBy: { connect: { id: '1' } },
        map: { connect: { id: '1' } },
        playerCharacter: { connect: { id: '1' } },
      },
    });
    console.debug('📂 Creating new plugin...');
    await prisma.plugin.create({
      data: {
        name: 'Example Plugin',
        url: 'https://github.com/tarrasqueapp/tarrasque-example-plugin',
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
