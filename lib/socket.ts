import { Socket, io } from 'socket.io-client';

import { SocketEmitEvents, SocketListenEvents } from './events';

export type CustomSocket = Socket<SocketListenEvents, SocketEmitEvents>;

export const socket: CustomSocket = io({
  path: '/socket.io',
  transports: ['websocket'],
  autoConnect: false,
});
