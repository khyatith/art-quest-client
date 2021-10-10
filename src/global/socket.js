/* eslint-disable import/prefer-default-export */
import { io } from 'socket.io-client';

// eslint-disable-next-line import/prefer-default-export

export const socket = io.connect('https://art-quest-server.herokuapp.com/', {
  withCredentials: true,
});

export const leaderboardSocket = io.connect('https://art-quest-server.herokuapp.com/leaderboard-namespace', {
  withCredentials: true,
});
