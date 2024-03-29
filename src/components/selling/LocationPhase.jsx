/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable function-paren-newline */
/* eslint-disable object-curly-newline */
/* eslint-disable no-empty */
/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable prefer-const */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { makeStyles, styled } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Typography, Snackbar, Button } from '@material-ui/core';
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
import SelectedDestination from '../SelectedDestination/SelectedDestination';

const CustomizedSnackbar = styled(Snackbar)({
  '& .MuiSnackbarContent-root': {
    backgroundColor: '#ff5050',
    width: '10rem',
    height: '3rem',
    color: 'white',
    fontSize: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
  },
});

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
    flexGrow: 1,
    position: 'fixed',
  },
  timercontent: {
    display: 'none',
    margin: '0 auto',
    // fontWeight: '700',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    // color: '#051207',
    fontSize: '22px',
  },
  playerdiv: {
    // fontWeight: 700,
    // color: '#051207', // green color
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
  const [startTimer, setStartTimer] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const setLocationData = (newData) => {
    const datasets = [];
    const { amountSpentByTeam, visits, roundNumber, allTeams, flyTicketsPrice, classifyPoints } = newData.data;
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
    const tmpArr = teamLastVisits;
    if (tmpArr?.length === 0) {
      allTeams.map((team) =>
        tmpArr.push({
          color: team,
          locationId: 1,
        }),
      );
    }
    setTeamLastVisits(tmpArr);
    let totalPoints = {};
    allTeams.forEach((value) => {
      const team = value;
      const cash = amountSpentByTeam[team] || 0;
      let vis = 0;
      const teamVisits = visits.filter((v) => v.teamName === team);
      vis = teamVisits && teamVisits.length > 0 && teamVisits[0].totalVisitPrice ? parseInt(teamVisits[0].totalVisitPrice, 10) : 0.0;
      const formattedCash = parseFloat(cash / 10).toFixed(2);
      const classifyPoint = +classifyPoints[team] ? +classifyPoints[team] : 0;
      console.log('classifyPoint-> ', classifyPoint);
      const total = parseFloat(formattedCash) - parseFloat(vis) + classifyPoint; // need to replace 0 with classifyPoints
      totalPoints[value] = total;
      // eslint-disable-next-line no-nested-ternary
      datasets.push(createData(team, cash, vis, classifyPoint)); // need to replace 0 with classifyPoints
      tv.push(createDataMap(x, team, vis, cash, total, classifyPoint, formattedCash)); // need to replace 0 with classifyPoints
      teams.push(team);
      x += 1;
    });
    sessionStorage.setItem('TOTAL_POINTS', JSON.stringify(totalPoints));
    const currentTeamVisits = visits.filter((v) => v.teamName === player.teamName);
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
    sessionStorage.setItem('sellingPhaseTotalPoints', JSON.stringify(tv));

    if (roundNumber) {
      setRoundId(roundNumber);
    }
    setLoading(false);
  };

  // Hooks and methods
  useEffect(() => {
    const setLocationPhaseData = async () => {
      const newData = await axios.get(`${API_URL}/buying/getSellingResults?roomId=${player.hostCode}`);
      if (newData.data.message === 'GAME_ENDED') {
        setLoading(false);
        setOpenSnackBar(true);
        // setFetchedFinalResults(true);
      } else {
        setLocationData(newData);
      }
    };
    if (!currentRoundData) {
      setLoading(true);
      setCurrentRoundData(true);
      setLocationPhaseData();
    }
  }, []);

  useEffect(() => {
    if (openSnackBar) {
      setTimeout(() => {
        history.push(`/end-game/${player.hostCode}`);
      }, 5000);
    }
  }, [openSnackBar]);

  useEffect(() => {
    if (roundId || currentLocationId) {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const updatedUser = {
        ...user,
        roundId,
        previousLocation: currentLocationId,
        currentLocation: selectedLocationId,
      };
      setPlayer((prevValues) => ({
        ...prevValues,
        ...updatedUser,
      }));
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, [roundId, currentLocationId, setPlayer, selectedLocationId]);

  const setLocationSelectedForCurrentRound = (value, locId) => {
    setSelectedLocation(value);
    setSelectedLocId(locId);
  };

  const getRandomLocation = async (currLoc) => {
    const { data } = await axios.get(`${API_URL}/buying/getMap`);
    if (disabledLocations && disabledLocations.includes(parseInt(currentLocationId, 10))) {
      const selectedRadioOption = Object.entries(data)
        .map((items) => items[1].allowedToVisit)
        .find((av) => parseInt(av, 10) !== parseInt(currentLocationId, 10));
      // eslint-disable-next-line prefer-destructuring
      return selectedRadioOption[0];
    }
    return currLoc;
  };
  const getRemainingTime = () => {
    const total = parseInt(locationPageTimerValue.total, 10) - 1000;
    const seconds = Math.floor((parseInt(total, 10) / 1000) % 60);
    const minutes = Math.floor((parseInt(total, 10) / 1000 / 60) % 60);
    if (total < 1000) {
      // console.log('selectedLocationId', selectedLocationId);
      // console.log('currentLocationId', currentLocationId);
      if (!selectedLocationId) {
        console.log('inside !selected location id');
        // getRandomLocation(currentLocationId).then((randomLocation) => {
        //   console.log('randomLocation1->', randomLocation);
        //   setSelectedLocId(randomLocation);
        //   socket.emit('putCurrentLocation', {
        //     roomId: player.hostCode,
        //     locationId: randomLocation,
        //     teamName: player.teamName,
        //     roundId,
        //     flyTicketPrice: 100,
        //   });
        setTimeout(() => {
          setSelectedLocation(false);
          socket.emit('locationPhaseTimerEnded', { player });
        }, 0);
        // });
      } else {
        socket.emit('locationPhaseTimerEnded', { player });
        setSelectedLocation(false);
      }
      // if (!selectedLocationId) {
      //   setLocationSelectedForCurrentRound(true, currentLocationId);
      // }
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

  // const getEndGameFlag = async () => {
  //   const response = await axios({
  //     url: `${API_URL}/buying/hasGameEnded`,
  //     method: 'POST',
  //     headers: {
  //       'content-type': 'application/json',
  //     },
  //     data: JSON.stringify({ roomId: player.hostCode }),
  //   });
  //   if (response.data.message === 'GAME_ENDED') {
  //     history.push(`/end-game/${player.hostCode}`);
  //   }
  // };

  useEffect(() => {
    socket.on('goToExpo', () => {
      if (!selectedLocationId) {
        // let randomLocation = currentLocationId;
        getRandomLocation(currentLocationId).then((randomLocation) => {
          setSelectedLocId(randomLocation);
          socket.emit('putCurrentLocation', {
            roomId: player.hostCode,
            locationId: randomLocation,
            teamName: player.teamName,
            roundId,
            flyTicketPrice: 100,
          });
          const user = JSON.parse(sessionStorage.getItem('user'));
          if (currentLocationId) {
            const updatedUser = {
              ...user,
              roundId,
              previousLocation: currentLocationId,
              currentLocation: randomLocation,
            };
            //   console.log('->', user, updatedUser);
            //   // setPlayer((prevValues) => ({
            //   //   ...prevValues,
            //   //   ...updatedUser,
            //   // }));
            sessionStorage.setItem('user', JSON.stringify(updatedUser));
          }
          setTimeout(() => {
            history.push(`/sell/${player.playerId}`);
          }, 3000);
        });
      } else {
        setTimeout(() => {
          history.push(`/sell/${player.playerId}`);
        }, 5000);
      }
    });
    return () => {
      socket.off('goToExpo');
    };
  }, [selectedLocationId, currentLocationId]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (locationPageTimerValue && startTimer) {
      const interval = setInterval(() => getRemainingTime(), 1000);
      return () => clearInterval(interval);
    }
  });
  useEffect(() => {
    if (startTimer) {
      socket.emit('startTimer', { player });
    }
  }, [startTimer]);

  // useEffect(() => {
  //   getEndGameFlag();
  // }, []);

  // useEffect(() => {
  //   getEndGameFlag();
  // }, []);

  useEffect(() => {
    const getTimer = async () => {
      await axios
        .get(`${API_URL}/buying/startAirportTimer?roomId=${player.hostCode}`)
        .then((newData) => {
          if (newData?.data?.locationPhaseTimerValue) {
            setLocationPageTimerValue(newData.data.locationPhaseTimerValue);
          }
        })
        .catch((e) => console.log(e));
    };
    if (startTimer) {
      getTimer();
    }
  }, [startTimer]);
  useEffect(() => {
    socket.on('timerStarted', () => {
      if (!startTimer) {
        setStartTimer(true);
      }
    });
    return () => socket.off('timerStarted');// added this
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
      if (!startTimer) {
        setStartTimer(true);
      }
    });
    return () => socket.off('locationUpdatedForTeam');
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

  if (loading) {
    return (
      <div style={{ marginTop: '12%', marginLeft: '43%' }}>
        {' '}
        <img src={load} alt="loading..." />{' '}
      </div>
    );
  }

  return (
    <div style={{ height: '100vh' }}>
      <AppBar className={classes.appbar}>
        <Toolbar>
          {startTimer && (
            <Typography variant="h6" className={classes.timercontent}>
              {selectedLocationId ? 'Reaching in' : 'Time left to fly'} {locationPageTimerValue && locationPageTimerValue.minutes}:
              {locationPageTimerValue && locationPageTimerValue.seconds}
            </Typography>
          )}
          {player && (
            <div className={classes.playerdiv}>
              <p>
                {player.playerName}, Team&nbsp;
                {player.teamName}, {player.playerId}
              </p>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {openSnackBar && (
        <CustomizedSnackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={openSnackBar}
          message="Game has ended"
          key="top center"
          sx={{ width: '100%' }}
        />
      )}
      {!selectedLocationId && (
        <>
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
            {/* <div className={classes.levelOfInterest}>
          <h3>Level of Interest In Art</h3>
          <LevelOfInterest />
        </div> */}
          </div>
        </>
      )}
      {selectedLocationId && <SelectedDestination player={player} chosenLocationForTeams={chosenLocationForTeams} selectedLocationId={selectedLocationId} />}
    </div>
  );
}

export default LocationPhase;
