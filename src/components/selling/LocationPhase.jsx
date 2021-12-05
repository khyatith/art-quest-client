import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import userContext from '../../global/userContext';
import Airport from './Airport';
import BarGraph from './BarGraph';
import Details from './Details';
import Mapping from './Mapping';
import { API_URL, TEAM_COLOR_MAP } from '../../global/constants';
import load from '../../assets/load.webp';
import { socket } from '../../global/socket';
import RoundsInfo from '../RoundsInfo';

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
    position: 'relative',
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
  str.push(cash);
  str.push(vis);
  return {
    label: team,
    backgroundColor: TEAM_COLOR_MAP[team],
    data: str,
    barThickness: 25,
  };
}

function createDataMap(id, team, visits, cash, total) {
  return {
    id,
    team,
    visits,
    cash,
    total,
  };
}

function LocationPhase() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [result, setResult] = useState({});
  const { player, setPlayer } = useContext(userContext);
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [hasLocationPageTimerEnded, setHasLocationPageTimerEnded] = useState(false);
  const [locationPageTimerValue, setLocationPageTimerValue] = useState();
  const [roundId, setRoundId] = useState();
  const [hasLocationSelected, setSelectedLocation] = useState(false);
  const [selectedLocationId, setSelectedLocId] = useState();
  const [currentLocationId, setCurrentLocationId] = useState();
  const [teamsCurrentLocation, setTeamsCurrentLocation] = useState();

  // Hooks and methods
  useEffect(() => {
    if (!hasLocationSelected) {
      setLoading(true);
      const datasets = [];
      axios
        .get(`${API_URL}/buying/getSellingResults?roomId=${player.hostCode}`)
        .then((newData) => {
          const {
            amountSpentByTeam, visits, locationPhaseTimerValue, roundNumber,
          } = newData.data;
          setTeamsCurrentLocation(newData.data.visits);
          let x = 1;
          const tv = [];
          const labels = ['Cash', 'Visits'];
          Object.entries(amountSpentByTeam).forEach(([key, value]) => {
            const team = key;
            const cash = value;
            let vis = 0;
            const teamVisits = visits.filter((v) => v.teamName === key);
            vis = teamVisits.length > 0 ? teamVisits[0].visitCount : 0.00;
            const total = parseFloat(cash) + parseFloat(vis);
            // eslint-disable-next-line no-nested-ternary
            datasets.push(createData(team, cash, vis));
            tv.push(createDataMap(x, team, vis, cash, total));
            x += 1;
          });
          const currentTeamVisits = visits.filter((v) => v.teamName === player.teamName);
          const currentLocationForTeam = currentTeamVisits.length === 0 ? 2 : currentTeamVisits[0].currentLocation;
          tv.sort((a, b) => b.total - a.total);
          for (let i = 0; i < tv.length; ++i) {
            tv[i].id = i + 1;
          }
          setCurrentLocationId(currentLocationForTeam);
          setResult({ labels, datasets });
          setRows(tv);
          setLocationPageTimerValue(locationPhaseTimerValue);
          if (roundNumber) {
            setRoundId(roundNumber);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [player, hasLocationSelected]);

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
    if (Object.keys(locationPageTimerValue).length <= 0) {
      if (!selectedLocationId) {
        setLocationSelectedForCurrentRound(true, currentLocationId);
      }
      setHasLocationPageTimerEnded(true);
      return;
    }
    const total = parseInt(locationPageTimerValue.total, 10) - 1000;
    const seconds = Math.floor((parseInt(total, 10) / 1000) % 60);
    const minutes = Math.floor((parseInt(total, 10) / 1000 / 60) % 60);
    if (total < 1000) {
      if (!selectedLocationId) {
        setLocationSelectedForCurrentRound(true, currentLocationId);
      }
      setHasLocationPageTimerEnded(true);
    } else {
      const value = {
        total,
        minutes: minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
        seconds: seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
      };
      setLocationPageTimerValue(value);
    }
  };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (locationPageTimerValue) {
      const interval = setInterval(() => getRemainingTime(), 1000);
      return () => clearInterval(interval);
    }
  });

  useEffect(() => {
    if (hasLocationPageTimerEnded) {
      setSelectedLocation(false);
      history.push(`/sell/${player.playerId}`);
    }
  }, [hasLocationPageTimerEnded, player.playerId, history]);

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

  // IMPORTANT (KOGNITI CHANGE)

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
          <Mapping />
        </div>
        <div className={classes.child1}>
          <Airport
            roundNumber={roundId}
            hasLocationSelected={hasLocationSelected}
            selectedLocationId={selectedLocationId}
            previousLocationId={currentLocationId}
            allLocationDetails={teamsCurrentLocation}
          />
        </div>
      </div>
      <p className={classes.resultsText}>Results</p>
      <div className={classes.parent}>
        <div className={classes.child2}>
          <Details rows={rows} />
        </div>
        <div className={classes.child2}>
          <BarGraph result={result} />
        </div>
      </div>
    </>
  );
}

export default LocationPhase;
