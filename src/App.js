import { BrowserRouter, Switch, Route } from 'react-router-dom';
import React, { useState } from 'react';
import LaunchScreen from './components/LaunchScreen';
import StagingScreen from './components/StagingScreen';
import Game from './components/Game';
import userContext from './global/userContext';
import leaderboardContext from './global/leaderboardContext';
import GameInstructions from './components/GameInstructions';

function App() {
  const [player, setPlayer] = useState({
    playerName: '',
    teamName: '',
    playerId: '',
    hostCode: '',
  });
  const [leaderboardData, setLeaderboardData] = useState({
    leaderboard: {},
    totalAmountForAllTeams: {},
  });
  return (
    <BrowserRouter>
      <userContext.Provider value={{ player, setPlayer }}>
        <leaderboardContext.Provider value={{ leaderboardData, setLeaderboardData }}>
          <Switch>
            <Route path="/" exact component={LaunchScreen} />
            <Route path="/staging/:code" exact component={StagingScreen} />
            <Route path="/art-quest/instructions" exact component={GameInstructions} />
            <Route path="/game/:code">
              <Game />
            </Route>
          </Switch>
        </leaderboardContext.Provider>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;
