import { BrowserRouter, Switch, Route } from 'react-router-dom';
import React, { useState } from 'react';
import LaunchScreen from './components/LaunchScreen';
import StagingScreen from './components/StagingScreen';
import Game from './components/Game';
import userContext from './global/userContext';
import GameInstructions from './components/GameInstructions';

function App() {
  const [player, setPlayer] = useState({
    playerName: '',
    teamName: '',
    playerId: '',
    hostCode: '',
  });
  return (
    <BrowserRouter>
      <userContext.Provider value={{ player, setPlayer }}>
        <Switch>
          <Route path="/" exact component={LaunchScreen} />
          <Route path="/staging/:code" exact component={StagingScreen} />
          <Route path="/art-quest/instructions" exact component={GameInstructions} />
          <Route path="/game/:code">
            <Game />
          </Route>
        </Switch>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;
