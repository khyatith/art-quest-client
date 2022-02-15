import React, {
  useEffect, useState, useContext, useCallback,
} from 'react';
// import PropTypes from 'prop-types';
import axios from 'axios';
import { TextField, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import userContext from '../../global/userContext';
import { API_URL, TEAM_COLOR_MAP } from '../../global/constants';
import { validateCurrentBid } from '../../global/helpers';
import RoundsInfo from '../RoundsInfo';
import { socket } from '../../global/socket';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#ffffff',
    marginTop: '4%',
    // marginLeft: '5%',
    paddingLeft: '15px',
    color: 'black',
    paddingBottom: '5%',
    paddingTop: '4%',
    border: '0.4px solid #cccccc',
  },
  radio: {
    marginBottom: '10px',
  },
  btnform: {
    backgroundColor: '#051207',
    margin: '20px 0 20px 0px',
    width: 245,
    color: '#76e246',
    fontWeight: 700,
  },
  teammark: {
    height: '35px',
    width: '35px',
    borderRadius: '50%',
    display: 'inline-block',
    margin: '20px',
  },
  parent: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  child1: {
    marginTop: '0.5%',
    paddingBottom: '0.5%',
  },
  form: {
    margin: '20px 0 20px 0px',
    width: 245,
  },
  hr: {
    marginLeft: '-15px',
  },
}));

const Airport = ({
  roundNumber,
  hasLocationSelected,
  selectedLocationId,
  previousLocationId,
  allLocationDetails,
  locations,
  chosenLocationForTeams,
  ticketPricesForLocations,
  setTicketPricesForLocations,
}) => {
  console.log('ticketPricesForLocations in airport', ticketPricesForLocations);
  const classes = useStyles();
  const [mapValues, setMapValues] = useState({});
  // const [teamValues, setTeamValues] = useState({});
  const [valRet, setValRet] = useState(false);
  const { player, setPlayer } = useContext(userContext);
  const [selectedRadio, setSelectedRadio] = useState(previousLocationId);
  const [updatedLocation, setUpdatedLocation] = useState(false);
  const [flyTicketPrice, setFlyTicketPrice] = useState(0);
  const [flyInputError, setFlyInputError] = useState(null);
  const [selectedLocationTicketPrice, setSelectedLocationTicketPrice] = useState();

  const updateSelectedLocationTicketPrice = () => {
    Object.entries(ticketPricesForLocations).forEach(([key, value]) => {
      console.log('key', key);
      console.log('selectedRadio', selectedRadio);
      if (parseInt(selectedRadio, 10) === parseInt(key, 10)) {
        console.log('inside >>>>>>', selectedRadio, key);
        setSelectedLocationTicketPrice(parseInt(value, 10));
      } else {
        setSelectedLocationTicketPrice();
      }
    });
  };

  const setVisitLocation = () => {
    const isValidTicketPrice = validateCurrentBid(flyTicketPrice);
    if (!isValidTicketPrice) {
      setFlyInputError('Please enter a valid ticket price');
    } else {
      setFlyInputError(null);
      socket.emit('putCurrentLocation', {
        roomId: player.hostCode,
        locationId: selectedRadio,
        teamName: player.teamName,
        roundId: roundNumber,
        flyTicketPrice,
      });
    }
  };

  const handleTicketPriceChange = (e) => {
    setFlyTicketPrice(e.target.value);
  };

  const updateLocName = useCallback(() => {
    let locName;
    const selectedLoc = selectedLocationId;
    // if ((locations.filter((v) => (parseInt(v, 10) === parseInt(previousLocationId, 10))).length) >= 2) {
    //   selectedLoc = selectedRadio;
    // }
    Object.entries(mapValues).forEach((val) => {
      if (parseInt(val[1].cityId, 10) === parseInt(selectedLoc, 10)) {
        locName = val[1].cityName;
      }
    });
    const updatedPlayer = {
      ...player,
      currentLocation: parseInt(selectedLoc, 10),
      currentLocationName: locName,
    };
    setPlayer(updatedPlayer);
    // 1. update session storage
    sessionStorage.setItem('user', JSON.stringify(updatedPlayer));
  }, [selectedLocationId, mapValues, player, setPlayer]);

  // Hooks and methods
  useEffect(() => {
    async function getMapVal() {
      const { data } = await axios.get(`${API_URL}/buying/getMap`);
      for (let i = 0; i < data.length; ++i) {
        if (parseInt(data[i].cityId, 10) === parseInt(previousLocationId, 10)) {
          if ((locations.filter((v) => (parseInt(v, 10) === parseInt(previousLocationId, 10))).length) >= 2) {
            for (let j = 0; j < data[i].allowedToVisit.length; ++j) {
              if ((locations.filter((v) => (parseInt(v, 10) === parseInt(data[i].allowedToVisit[j], 10))).length) < 2) {
                setSelectedRadio(parseInt(data[i].allowedToVisit[j], 10));
                updateSelectedLocationTicketPrice();
                break;
              }
            }
          }
          break;
        }
      }
      setMapValues(data);
    }
    if (!valRet && !hasLocationSelected) {
      getMapVal();
      setValRet(true);
    }
  }, [valRet, hasLocationSelected]);

  useEffect(() => {
    if (ticketPricesForLocations) {
      updateSelectedLocationTicketPrice();
    }
  }, [selectedRadio]);

  useEffect(() => {
    if (hasLocationSelected && selectedLocationId && !updatedLocation) {
      updateLocName();
      setUpdatedLocation(true);
    }
  }, [hasLocationSelected, selectedLocationId, updateLocName, updatedLocation]);

  const updateSelectedLocation = (e) => {
    setSelectedRadio(parseInt(e.target.value, 10));
    axios
      .get(`${API_URL}/buying/getFlyTicketPriceForLocation?roomId=${player.hostCode}`)
      .then((data) => {
        console.log('data', data);
        setTicketPricesForLocations(data.ticketPriceByLocation);
      });
  };

  const getLocationNameById = (prevLocId) => {
    let result;
    Object.entries(mapValues).forEach((val) => {
      if (parseInt(val[1].cityId, 10) === parseInt(prevLocId, 10)) {
        result = val[1].cityName;
      }
    });
    return result;
  };

  return (
    <>
      <div className={classes.root}>
        {mapValues && previousLocationId && <RoundsInfo marginTop="20px" label={`You are currently in ${getLocationNameById(previousLocationId)}`} />}
        {!hasLocationSelected ? (
          <>
            <p style={{ marginTop: '40px' }}>Fly to : </p>
            {Object.entries(mapValues).map((items) => {
              const totalCon = items[1].allowedToVisit;
              if (!totalCon.includes(previousLocationId)) {
                totalCon.push(previousLocationId);
              }
              if (parseInt(items[1].cityId, 10) === parseInt(previousLocationId, 10)) {
                return (
                  <>
                    {totalCon.map((tloc) => {
                      const obj = mapValues.find((x) => parseInt(x.cityId, 10) === parseInt(tloc, 10));
                      return (
                        <div className={classes.radio} key={obj.cityId}>
                          <input
                            type="radio"
                            value={obj.cityId}
                            key={obj.cityId}
                            disabled={hasLocationSelected || (locations.filter((v) => (parseInt(v, 10) === parseInt(obj.cityId, 10))).length) >= 2}
                            name="location"
                            checked={parseInt(selectedRadio, 10) === parseInt(obj.cityId, 10)}
                            onChange={updateSelectedLocation}
                          />
                          {' '}
                          {obj.cityName}
                        </div>
                      );
                    })}
                    { selectedLocationTicketPrice && <h4>{`Current price in ${getLocationNameById(selectedRadio)} is $${selectedLocationTicketPrice}`}</h4> }
                    <TextField
                      error={!!flyInputError}
                      helperText={flyInputError && flyInputError}
                      className={classes.form}
                      name="ticketPrice"
                      label="Enter ticket price"
                      variant="outlined"
                      onChange={handleTicketPriceChange}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </>
                );
              }
              return <></>;
            })}
          </>
        ) : (
          hasLocationSelected && (
            <p>
              Your team&apos;s next destination:
              {player.currentLocationName && player.currentLocationName}
            </p>
          )
        )}
        <Button className={classes.btnform} variant="contained" onClick={setVisitLocation} disabled={hasLocationSelected}>
          Fly
        </Button>
        <div className={classes.parent}>
          {allLocationDetails
            && mapValues
            && allLocationDetails.map((arg) => {
              let ind = -1;
              for (let i = 0; i < mapValues.length; i++) {
                if (mapValues[parseInt(i, 10)].cityId === parseInt(arg.currentLocation, 10)) {
                  ind = parseInt(i, 10);
                  break;
                }
              }
              return (
                <div className={classes.child1}>
                  <div className={classes.teammark} style={{ backgroundColor: TEAM_COLOR_MAP[arg.teamName], borderRadius: '100%' }} />
                  <div style={{ margin: 'auto', textAlign: 'center' }}>{parseInt(ind, 10) !== -1 && mapValues[parseInt(ind, 10)].cityName}</div>
                </div>
              );
            })}
        </div>
        <hr className={classes.hr} />
        <div className={classes.parent}>
          {chosenLocationForTeams && <h4>All team's next destination</h4>}
          {chosenLocationForTeams
            && Object.values(chosenLocationForTeams).map((chosenLocation) => {
              const chosenTeamName = getLocationNameById(chosenLocation.locationId);
              return (
                <div className={classes.child1}>
                  <div className={classes.teammark} style={{ backgroundColor: TEAM_COLOR_MAP[chosenLocation.teamName], borderRadius: '100%' }} />
                  <div style={{ margin: 'auto', textAlign: 'center' }}>{chosenTeamName}</div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

// Airport.defaultProps = {
//   roundNumber: 1,
//   hasLocationSelected: false,
//   selectedLocationId: 1,
//   previousLocationId: 1,
// };

// Airport.propTypes = {
//   roundNumber: PropTypes.number.isRequired,
//   hasLocationSelected: PropTypes.bool.isRequired,
//   selectedLocationId: PropTypes.number.isRequired,
//   previousLocationId: PropTypes.number.isRequired,
// };

export default Airport;
