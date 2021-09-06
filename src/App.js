import { BrowserRouter, Switch, Route } from 'react-router-dom';
import React, { useState } from 'react';
import LaunchScreen from './components/lauchScreen';
import StagingScreen from './components/StagingScreen';
import Game from './components/Game';
import userContext from './global/userContext';

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
          <Route path="/game/:code">
            <Game />
          </Route>
        </Switch>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;
