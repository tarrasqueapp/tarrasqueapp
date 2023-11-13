import { afterAll, afterEach, beforeAll, expect, it } from '@jest/globals';
import http from 'http';
import SocketIO from 'socket.io';

import { TarrasqueEmitEvents, TarrasqueEvent, TarrasqueListenEvents } from '../src/events';
import { tarrasque } from '../src/tarrasque';
import { CharacterEntity } from '../src/types';

// Create Socket.IO server and client instance
let server: http.Server;
let io: SocketIO.Server<TarrasqueListenEvents & TarrasqueEmitEvents, TarrasqueListenEvents & TarrasqueEmitEvents>;

// A character to use in tests
const character: CharacterEntity = {
  id: 'character-1',
  name: 'Character name',
  data: {},
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  createdById: 'user-1',
  campaignId: 'campaign-1',
  mediaIds: [],
};

// Create a Socket.IO server and listen on port 3000
beforeAll(async () => {
  server = http.createServer();
  io = new SocketIO.Server(server);
  server.listen(3000);

  // Create an array to store the characters
  const characters = [];

  // Listen for the CREATE_CHARACTER event
  io.on('connection', (socket) => {
    socket.on(TarrasqueEvent.CREATE_CHARACTER, (data) => {
      characters.push(data);

      // Emit the CHARACTER_CREATED event
      io.emit(TarrasqueEvent.CHARACTER_CREATED, data);
    });
  });
});

// Close the Socket.IO server after all tests
afterAll(async () => {
  server.close();
});

// Disconnect the tarrasque instance after each test
afterEach(() => {
  tarrasque.disconnect();
});

it('initializes with the default config', () => {
  expect(tarrasque.url).toBe('https://tarrasque.app');
});

it('initializes with a custom config', () => {
  tarrasque.init({ url: 'http://localhost:3000' });
  expect(tarrasque.url).toBe('http://localhost:3000');
});

it('emits and listens for events', (done) => {
  tarrasque.init({ url: 'http://localhost:3000' });

  // Listen for the event on the Tarrasque SDK
  tarrasque.on(TarrasqueEvent.CHARACTER_CREATED, (data) => {
    expect(data).toEqual(character);
    done();
  });

  // Emit the event on the Tarrasque SDK
  tarrasque.emit(TarrasqueEvent.CREATE_CHARACTER, character);
});
