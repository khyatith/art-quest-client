import { BrowserRouter, Switch, Route } from 'react-router-dom';
import React, { useState } from 'react';
import LaunchScreen from './components/LaunchScreen';
import StagingScreen from './components/StagingScreen';
import Game from './components/Game';
import userContext from './global/userContext';
import leaderboardContext from './global/leaderboardContext';
import auctionContext from './global/auctionContext';
import GameInstructions from './components/GameInstructions';
import LocationPhase from './components/selling/LocationPhase';
import SellingResults from './components/selling/SellingResults';
import FinalResults from './components/selling/FinalResults';
import EnglishAuction from './components/buying/EnglishAuction';
import SecretAuction from './components/buying/SecretAuction';
import SellingGameInstructions from './components/selling/SellingGameInstructions';
import EndBuyingPhase from './components/EndBuyingPhase';
import DutchAuction from './components/DutchAuction';
// import ExpoBegining from './components/selling/ExpoBegining';
import ExpoBegining2 from './components/selling/ExpoBeginning2/ExpoBegining2';

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
              <Route path="/buying/results/:code" exact component={EndBuyingPhase} />
              <Route path="/game/:code">
                <Game />
              </Route>
              <Route path="/englishAuction/:code" component={EnglishAuction} />
              <Route path="/secretAuctions/:code" component={SecretAuction} />
              <Route path="/dutchAuction/:code" component={DutchAuction} />
              {/* <Route path="/sell/:code" exact component={ExpoBegining} /> */}
              <Route path="/sell/:code" exact component={ExpoBegining2} />
              <Route path="/sell/location/:code" exact component={LocationPhase} />
              <Route path="/sell/result/:code" exact component={SellingResults} />
              <Route path="/sell/instructions/:code" exact component={SellingGameInstructions} />
              <Route path="/sell/finalresult/:code">
                <FinalResults />
              </Route>
            </Switch>
          </auctionContext.Provider>
        </leaderboardContext.Provider>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;
