import React from 'react';

const userContext = React.createContext({
  playerName: '',
  teamName: '',
  playerId: '',
  hostCode: '',
  teamColor: '',
  currentLocation: '',
});

export default userContext;
