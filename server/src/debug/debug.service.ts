import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DebugService {
  constructor(private prisma: PrismaService) {}

  async createNewData() {
    console.debug('Creating new user...');
    await this.prisma.user.create({
      data: {
        id: '1',
        name: 'Richard',
        email: 'rsolomou@gmail.com',
        password: 'password',
      },
    });
    console.debug('Creating new campaign...');
    await this.prisma.campaign.create({
      data: {
        id: '1',
        name: 'Test Campaign',
        createdBy: { connect: { id: '1' } },
      },
    });
    console.debug('Creating new map...');
    await this.prisma.map.create({
      data: {
        id: '1',
        name: 'Test Map',
        media: {
          create: {
            url: '/map.webp',
            thumbnail: '/map.webp',
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
    console.debug('Creating new player character...');
    await this.prisma.playerCharacter.create({
      data: {
        id: '1',
        name: 'Test Player Character',
        armorClass: { create: { description: 'Natural armor' } },
        hitPoints: { create: {} },
        movement: { create: {} },
        senses: { create: { darkvision: 60 } },
        currencies: { create: { gold: 30, silver: 10 } },
        media: {
          create: {
            url: '/token.webp',
            thumbnail: '/token.webp',
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
    console.debug('Creating new token...');
    await this.prisma.token.create({
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
    console.debug('Creating new plugin...');
    await this.prisma.plugin.create({
      data: {
        name: 'D&D Beyond Integration',
        url: 'https://www.dndbeyond.com/',
      },
    });
    console.debug('New data created.');
    return { success: true };
  }

  async deleteAllData() {
    console.debug('Deleting all media...');
    await this.prisma.media.deleteMany({});
    console.debug('Deleting all tokens...');
    await this.prisma.token.deleteMany({});
    console.debug('Deleting all maps...');
    await this.prisma.map.deleteMany({});
    console.debug('Deleting all movement types...');
    await this.prisma.movement.deleteMany({});
    console.debug('Deleting all hit points...');
    await this.prisma.hitPoints.deleteMany({});
    console.debug('Deleting all armor classes...');
    await this.prisma.armorClass.deleteMany({});
    console.debug('Deleting all senses...');
    await this.prisma.senses.deleteMany({});
    console.debug('Deleting all skills...');
    await this.prisma.skill.deleteMany({});
    console.debug('Deleting all abilities...');
    await this.prisma.ability.deleteMany({});
    console.debug('Deleting all currencies...');
    await this.prisma.currencies.deleteMany({});
    console.debug('Deleting all player characters...');
    await this.prisma.playerCharacter.deleteMany({});
    console.debug('Deleting all non-player characters...');
    await this.prisma.nonPlayerCharacter.deleteMany({});
    console.debug('Deleting all campaigns...');
    await this.prisma.campaign.deleteMany({});
    console.debug('Deleting all plugins...');
    await this.prisma.plugin.deleteMany({});
    console.debug('Deleting all users...');
    await this.prisma.user.deleteMany({});
    console.debug('All data deleted.');
    return { success: true };
  }
}
