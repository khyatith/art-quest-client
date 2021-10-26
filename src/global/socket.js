/* eslint-disable import/prefer-default-export */
import { io } from 'socket.io-client';

// eslint-disable-next-line import/prefer-default-export

// export const socket = io.connect('https://art-quest-server.herokuapp.com/');

export const socket = io.connect('http://localhost:3001');
