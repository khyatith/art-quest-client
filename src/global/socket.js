import { io } from 'socket.io-client';

// eslint-disable-next-line import/prefer-default-export
export const socket = io.connect('http://localhost:5000');
