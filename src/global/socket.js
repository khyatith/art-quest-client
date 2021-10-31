/* eslint-disable import/prefer-default-export */
import { io } from 'socket.io-client';
import { API_URL } from './constants';

// eslint-disable-next-line import/prefer-default-export

export const socket = io.connect(`${API_URL}/`);
