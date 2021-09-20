import React from 'react';

const userContext = React.createContext({
  playerName: '',
  teamName: '',
  playerId: '',
  hostCode: '',
  teamColor: '',
});

export default userContext;
