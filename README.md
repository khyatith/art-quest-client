# art-quest-multiplayer

# Install and run the repo on your local

1. npm install
2. npm run start:dev

# How to set up local server

1. Clone server repo on your local. Server repo - art-quest-server


2. To start local server on port 3001
     1. npm install
     2. npm run start

# Connect your local client to local server

1. On your client code, go to src/global/socket.js
2. Replace the code in the file to 

```
/* eslint-disable import/prefer-default-export */
import { io } from 'socket.io-client';

export const socket = io.connect('http://localhost:3001');

export const leaderboardSocket = io.connect('http://localhost:3001/leaderboard-namespace');
```
3. Go to src/components/LandingPage.jsx. Replace url in axios call

`https://art-quest-server.herokuapp.com/landing-page/timer/${player.hostCode}` 

with

`http://localhost:3001/buying/timer/${player.hostCode}`

# End

You should be able to start your node server and your client now and your client will be connecting to localhost:3001 to get the data.

