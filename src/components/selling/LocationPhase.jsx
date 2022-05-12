/* eslint-disable no-unused-vars */
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
import LevelOfInterest from './LevelOfInterest';

const useStyles = makeStyles((theme) => ({
  parent: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: '30px',
  },
  parent2: {
    display: 'flex',
    flexWrap: 'nowrap',
    marginBottom: '30px',
  },
  bargraph: {
    flex: '0 1 33%',
    marginTop: '50px',
    marginRight: '20px',
  },
  child2: {
    flex: '0 1 50%',
    marginTop: '1%',
    marginBottom: '30px',
    marginRight: '100px',
  },
  airport: {
    flex: '0 2 20%',
    marginTop: '0.5%',
  },
  resultstable: {
    flex: '0 1 35%',
    marginTop: '0.5%',
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
  levelOfInterest: {
    flex: '0 1 50%',
    maxWidth: '400px',
    marginTop: '20px',
    textAlign: 'center',
  },
}));

function createData(team, cash, vis, classifyPoints) {
  const str = [];
  const formattedCash = parseFloat(cash / 10).toFixed(2);
  str.push(formattedCash);
  str.push(vis);
  str.push(classifyPoints);
  return {
    label: team,
    backgroundColor: TEAM_COLOR_MAP[team],
    data: str,
    barThickness: 25,
  };
}

function createDataMap(id, team, visits, cash, total, classifyPoints, cashPoints) {
  return {
    id,
    team,
    visits,
    cash,
    total,
    classifyPoints,
    cashPoints,
  };
}

function LocationPhase() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [result, setResult] = useState({});
  const { player, setPlayer } = useContext(userContext);
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [locationPageTimerValue, setLocationPageTimerValue] = useState();
  const [roundId, setRoundId] = useState();
  const [hasLocationSelected, setSelectedLocation] = useState(false);
  const [selectedLocationId, setSelectedLocId] = useState();
  const [currentLocationId, setCurrentLocationId] = useState();
  const [teamsCurrentLocation, setTeamsCurrentLocation] = useState();
  const [chosenLocationForTeams, setChosenLocationForTeams] = useState();
  const [allLocationHistory, setAllLocationHistory] = useState([]);
  const [currentRoundData, setCurrentRoundData] = useState(false);
  const [disabledLocations, setDisabledLocations] = useState([]);
  const [ticketPricesForLocations, setTicketPricesForLocations] = useState();
  const [teamLastVisits, setTeamLastVisits] = useState([]);

  // Hooks and methods
  console.log('teams LastVisits', teamLastVisits);
  useEffect(() => {
    const datasets = [];
    if (!currentRoundData) {
      setLoading(true);
      axios
        .get(`${API_URL}/buying/getSellingResults?roomId=${player.hostCode}`)
        .then((newData) => {
          const {
            // eslint-disable-next-line no-unused-vars
            amountSpentByTeam, visits, locationPhaseTimerValue, roundNumber, allTeams, flyTicketsPrice,
          } = newData.data;
          if (newData.data.disabledLocations && newData.data.disabledLocations.length > 0) {
            setDisabledLocations(newData.data.disabledLocations);
          }
          if (flyTicketsPrice) {
            console.log('flyTicketPrice>>>>>', flyTicketsPrice);
            setTicketPricesForLocations(flyTicketsPrice.ticketPriceByLocation);
          }
          setTeamsCurrentLocation(visits);
          let x = 1;
          const tv = [];
          const labels = ['Cash Points', 'Visits', 'Classify Points'];
          const teams = [];
          console.log('teams->', allTeams);
          const tmpArr = teamLastVisits;
          if (tmpArr?.length === 0) {
            allTeams.map((team) => (
              tmpArr.push({
                color: team,
                locationId: 1,
              })
            ));
          }
          setTeamLastVisits(tmpArr);
          allTeams.forEach((value) => {
            const team = value;
            const cash = amountSpentByTeam[team] || 0;
            let vis = 0;
            const teamVisits = visits.filter((v) => v.teamName === team);
            vis = teamVisits && teamVisits.length > 0 && teamVisits[0].totalVisitPrice ? parseInt(teamVisits[0].totalVisitPrice, 10) : 0.0;
            // const artScore = totalArtScoreForTeams[team] || 0;
            const formattedCash = parseFloat(cash / 10).toFixed(2);
            const total = parseFloat(formattedCash) - parseFloat(vis) + 0; // need to replace 0 with classifyPoints
            // eslint-disable-next-line no-nested-ternary
            datasets.push(createData(team, cash, vis, 0)); // need to replace 0 with classifyPoints
            tv.push(createDataMap(x, team, vis, cash, total, 0, formattedCash)); // need to replace 0 with classifyPoints
            teams.push(team);
            x += 1;
          });
          const currentTeamVisits = visits.filter((v) => v.teamName === player.teamName);
          console.log('teams Locations Data->', visits);
          const currentLocationForTeam = currentTeamVisits.length === 0 ? 1 : currentTeamVisits[0].currentLocation;
          let opArr = teamLastVisits;
          visits.forEach((v) => {
            const array2 = opArr.map((a) => {
              const returnValue = { ...a };
              if (a.color === v.teamName) {
                returnValue.locationId = +v.currentLocation ? +v.currentLocation : 1;
              }
              return returnValue;
            });
            opArr = array2;
          });
          setTeamLastVisits(opArr);
          const locationHistory = currentTeamVisits.length === 0 ? [] : currentTeamVisits[0].allVisitLocations;
          setAllLocationHistory(locationHistory);
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
      const chosenLocation = {
        ...chosenLocationForTeams,
        [data.teamName]: data,
      };
      const ticketPrices = {
        ...ticketPricesForLocations,
        [data.locationId]: data.flyTicketPrice,
      };
      setTicketPricesForLocations(ticketPrices);
      setChosenLocationForTeams(chosenLocation);
      setDisabledLocations(data.disabledLocations);
      if (parseInt(data.roundId, 10) === parseInt(roundId, 10) && data.teamName === player.teamName) {
        setLocationSelectedForCurrentRound(true, parseInt(data.locationId, 10));
      }
    });
  });

  useEffect(() => {
    let opArr = teamLastVisits;
    if (chosenLocationForTeams) {
      Object.entries(chosenLocationForTeams).forEach((items) => {
        const { teamName } = items[1];
        const locId = items[1].locationId;
        const array2 = opArr.map((a) => {
          const returnValue = { ...a };
          if (a.color === teamName) {
            returnValue.locationId = +locId ? +locId : 1;
          }
          return returnValue;
        });
        opArr = array2;
      });
      setTeamLastVisits(opArr);
    }
  }, [chosenLocationForTeams]);
  console.log('location for team', chosenLocationForTeams);
  console.log('Currentlocation for team', currentLocationId);
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
          {player && (
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
      <RoundsInfo label={`Round ${roundId} of 4`} />
      <div className={classes.parent}>
        <div className={classes.resultstable}>
          <p className={classes.resultsText}>Results</p>
          <Details rows={rows} />
        </div>
        <div className={classes.bargraph}>
          <BarGraph result={result} />
        </div>
        <div className={classes.airport}>
          <Airport
            roundNumber={roundId}
            hasLocationSelected={hasLocationSelected}
            selectedLocationId={selectedLocationId}
            previousLocationId={currentLocationId}
            allLocationDetails={teamsCurrentLocation}
            locations={allLocationHistory}
            chosenLocationForTeams={chosenLocationForTeams}
            ticketPricesForLocations={ticketPricesForLocations}
            setTicketPricesForLocations={setTicketPricesForLocations}
            disabledLocations={disabledLocations}
          />
        </div>
      </div>
      <hr />
      <div className={classes.parent2}>
        <div className={classes.child2}>
          <Mapping disabledLocations={disabledLocations} teamLocations={teamLastVisits} />
        </div>
        <div className={classes.levelOfInterest}>
          <h3>Level of Interest In Art</h3>
          <LevelOfInterest />
        </div>
      </div>
    </>
  );
}

export default LocationPhase;
