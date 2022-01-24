import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import userContext from '../../global/userContext';
import Airport from './Airport';
// import BarGraph from './BarGraph';
import Details from './Details';
import Mapping from './Mapping';
import { API_URL, TEAM_COLOR_MAP } from '../../global/constants';
import load from '../../assets/load.webp';
import { socket } from '../../global/socket';
import RoundsInfo from '../RoundsInfo';
import LevelOfInterest from './LevelOfInterest';

const useStyles = makeStyles((theme) => ({
  parent: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  child1: {
    flex: '0 2 50%' /* explanation below */,
    marginTop: '0.5%',
    paddingBottom: '0.5%',
    borderBottom: '0.8%',
    borderTop: '0',
    borderLeft: '0',
    borderRight: '0',
    borderColor: 'rgb(214,214,218)',
    borderStyle: 'solid',
  },
  child2: {
    flex: '0 2 48%' /* explanation below */,
    marginTop: '1%',
    marginBottom: '30px',
  },
  resultsText: {
    display: 'block',
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: '700',
  },
  appbar: {
    backgroundColor: '#76e246',
    flexGrow: 1,
    position: 'fixed',
  },
  timercontent: {
    display: 'none',
    margin: '0 auto',
    fontWeight: '700',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    color: '#051207',
    fontSize: '22px',
  },
  playerdiv: {
    fontWeight: 700,
    color: '#051207', // green color
  },
}));

function createData(team, cash, vis) {
  const str = [];
  const formattedCash = parseFloat((cash) / 10).toFixed(2);
  str.push(formattedCash);
  str.push(vis);
  return {
    label: team,
    backgroundColor: TEAM_COLOR_MAP[team],
    data: str,
    barThickness: 25,
  };
}

function createDataMap(id, team, visits, cash, total, artScore) {
  return {
    id,
    team,
    visits,
    cash,
    total,
    artScore,
  };
}

function LocationPhase() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  // const [result, setResult] = useState({});
  const { player, setPlayer } = useContext(userContext);
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  // const [hasLocationPageTimerEnded, setHasLocationPageTimerEnded] = useState(false);
  const [locationPageTimerValue, setLocationPageTimerValue] = useState();
  const [roundId, setRoundId] = useState();
  const [hasLocationSelected, setSelectedLocation] = useState(false);
  const [selectedLocationId, setSelectedLocId] = useState();
  const [currentLocationId, setCurrentLocationId] = useState();
  const [teamsCurrentLocation, setTeamsCurrentLocation] = useState();
  const [allLocationHistory, setAllLocationHistory] = useState([]);
  const [currentRoundData, setCurrentRoundData] = useState(false);

  // Hooks and methods
  useEffect(() => {
    if (!currentRoundData) {
      setLoading(true);
      const datasets = [];
      axios
        .get(`${API_URL}/buying/getSellingResults?roomId=${player.hostCode}`)
        .then((newData) => {
          const {
            amountSpentByTeam, totalArtScoreForTeams, visits, locationPhaseTimerValue, roundNumber, players,
          } = newData.data;
          setTeamsCurrentLocation(newData.data.visits);
          // for (let i = 0; i < visits.length; ++i) {
          //   if (locationHistory[i].teamName === player.teamName) {
          //     setAllLocationHistory(locationHistory[i].allVisitLocations);
          //   }
          // }
          // console.log(allLocationHistory);
          let x = 1;
          const tv = [];
          // const labels = ['Cash', 'Visits'];
          const teams = [];
          Object.entries(amountSpentByTeam).forEach(([key, value]) => {
            const team = key;
            const cash = value;
            let vis = 0;
            const teamVisits = visits.filter((v) => v.teamName === key);
            vis = teamVisits.length > 0 ? teamVisits[0].visitCount : 0.00;
            const artScore = totalArtScoreForTeams[team] || 0;
            const total = parseFloat(cash) + parseFloat(vis);
            // eslint-disable-next-line no-nested-ternary
            // datasets.push(createData(team, cash, vis));
            tv.push(createDataMap(x, team, vis, cash, total, artScore));
            teams.push(team);
            x += 1;
          });
          for (let i = 1; i < players.length; ++i) {
            const found = teams.find((val) => val === players[i].teamName);
            if (!found) {
              datasets.push(createData(players[i].teamName, 0, 0));
              tv.push(createDataMap(x, players[i].teamName, 0, 0, 0, 0));
              x += 1;
            }
          }
          const currentTeamVisits = visits.filter((v) => v.teamName === player.teamName);
          const currentLocationForTeam = currentTeamVisits.length === 0 ? 2 : currentTeamVisits[0].currentLocation;
          const locationHistory = currentTeamVisits.length === 0 ? [] : currentTeamVisits[0].allVisitLocations;
          setAllLocationHistory(locationHistory);
          tv.sort((a, b) => b.total - a.total);
          for (let i = 0; i < tv.length; ++i) {
            tv[i].id = i + 1;
          }
          setCurrentLocationId(currentLocationForTeam);
          // setResult({ labels, datasets });
          setRows(tv);
          setLocationPageTimerValue(locationPhaseTimerValue);
          if (roundNumber) {
            setRoundId(roundNumber);
          }
        })
        .finally(() => {
          setLoading(false);
          setCurrentRoundData(true);
        });
    }
  }, [player]);

  useEffect(() => {
    if (roundId || currentLocationId) {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const updatedUser = {
        ...user,
        roundId,
        previousLocation: currentLocationId,
      };
      setPlayer((prevValues) => ({
        ...prevValues,
        ...updatedUser,
      }));
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, [roundId, currentLocationId, setPlayer]);

  const setLocationSelectedForCurrentRound = (value, locId) => {
    setSelectedLocation(value);
    setSelectedLocId(locId);
  };

  const getRemainingTime = () => {
    const total = parseInt(locationPageTimerValue.total, 10) - 1000;
    const seconds = Math.floor((parseInt(total, 10) / 1000) % 60);
    const minutes = Math.floor((parseInt(total, 10) / 1000 / 60) % 60);
    if (total < 1000) {
      socket.emit('locationPhaseTimerEnded', { player });
      if (!selectedLocationId) {
        setLocationSelectedForCurrentRound(true, currentLocationId);
      }
      setSelectedLocation(false);
      // setHasLocationPageTimerEnded(true);
    } else {
      const value = {
        total,
        minutes: minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
        seconds: seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
      };
      setLocationPageTimerValue(value);
    }
  };

  useEffect(() => {
    socket.on('goToExpo', () => {
      history.push(`/sell/${player.playerId}`);
    });
  }, []);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (locationPageTimerValue) {
      const interval = setInterval(() => getRemainingTime(), 1000);
      return () => clearInterval(interval);
    }
  });

  useEffect(() => {
    socket.on('locationUpdatedForTeam', (data) => {
      if (data.roundId === roundId && data.teamName === player.teamName) {
        setLocationSelectedForCurrentRound(true, data.locationId);
      }
    });
  });

  if (loading) {
    return (
      <div style={{ marginTop: '12%', marginLeft: '43%' }}>
        {' '}
        <img src={load} alt="loading..." />
        {' '}
      </div>
    );
  }

  return (
    <>
      <AppBar className={classes.appbar}>
        <Toolbar>
          <Typography variant="h6" className={classes.timercontent}>
            Time left to fly
            {' '}
            {locationPageTimerValue && locationPageTimerValue.minutes}
            :
            {locationPageTimerValue && locationPageTimerValue.seconds}
          </Typography>
          { player
            && (
            <div className={classes.playerdiv}>
              <p>
                {player.playerName}
                , Team&nbsp;
                {player.teamName}
                ,
                {' '}
                {player.playerId}
              </p>
            </div>
            )}
        </Toolbar>
      </AppBar>
      <RoundsInfo label={`Round ${roundId} of 10`} />
      <div className={classes.parent}>
        <div className={classes.child1}>
          <p className={classes.resultsText}>Results</p>
          <Details rows={rows} />
        </div>
        {/* <div className={classes.child1}>
          <BarGraph result={result} />
        </div> */}
        <div className={classes.child1}>
          <Airport
            roundNumber={roundId}
            hasLocationSelected={hasLocationSelected}
            selectedLocationId={selectedLocationId}
            previousLocationId={currentLocationId}
            allLocationDetails={teamsCurrentLocation}
            locations={allLocationHistory}
          />
        </div>
        <div className={classes.child2}>
          <Mapping />
        </div>
        <div className={classes.child2}>
          <LevelOfInterest />
        </div>
      </div>
    </>
  );
}

export default LocationPhase;
