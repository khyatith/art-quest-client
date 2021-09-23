import { io } from 'socket.io-client';

// eslint-disable-next-line import/prefer-default-export
export const socket = io.connect('https://art-quest-server.herokuapp.com/', { transports: ['websocket', 'polling', 'flashsocket'] });

export const leaderboardSocket = io.connect(
  'https://art-quest-server.herokuapp.com/leaderboard-namespace',
  {
    transports: ['websocket', 'polling', 'flashsocket'],
  },
); // the "leaderboards" namespace
