import { io } from 'socket.io-client';

// eslint-disable-next-line import/prefer-default-export
export const socket = io.connect('http://localhost:3001', { transports: ['websocket', 'polling', 'flashsocket'] });

export const leaderboardSocket = io.connect(
  'http://localhost:3001/leaderboard-namespace',
  {
    transports: ['websocket', 'polling', 'flashsocket'],
  },
); // the "leaderboards" namespace
