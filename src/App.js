import { BrowserRouter, Switch, Route } from 'react-router-dom';
import React, { useState } from 'react';
import LaunchScreen from './components/LaunchScreen';
import StagingScreen from './components/StagingScreen';
import Game from './components/Game';
import userContext from './global/userContext';
import leaderboardContext from './global/leaderboardContext';
import auctionContext from './global/auctionContext';
import GameInstructions from './components/GameInstructions';
import ExpoBegining from './components/selling/ExpoBegining';
import LocationPhase from './components/selling/LocationPhase';
import SellingResults from './components/selling/SellingResults';

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
  const [currentAuctionData, setCurrentAuctionData] = useState({
    currentAuctionObj: {},
  });
  return (
    <BrowserRouter>
      <userContext.Provider value={{ player, setPlayer }}>
        <leaderboardContext.Provider value={{ leaderboardData, setLeaderboardData }}>
          <auctionContext.Provider value={{ currentAuctionData, setCurrentAuctionData }}>
            <Switch>
              <Route path="/" exact component={LaunchScreen} />
              <Route path="/staging/:code" exact component={StagingScreen} />
              <Route path="/art-quest/instructions" exact component={GameInstructions} />
              <Route path="/game/:code">
                <Game />
              </Route>
              <Route path="/sell/:code" exact component={ExpoBegining} />
              <Route path="/sell/location/:code" exact component={LocationPhase} />
              <Route path="/sell/result/:code" exact component={SellingResults} />
            </Switch>
          </auctionContext.Provider>
        </leaderboardContext.Provider>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;
