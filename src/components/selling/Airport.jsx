import React, {
  useEffect, useState, useContext, useCallback,
} from 'react';
// import PropTypes from 'prop-types';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import userContext from '../../global/userContext';
import { API_URL, TEAM_COLOR_MAP } from '../../global/constants';
import RoundsInfo from '../RoundsInfo';
import { socket } from '../../global/socket';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#ffffff',
    marginTop: '4%',
    marginLeft: '25%',
    paddingLeft: '5%',
    marginRight: '25%',
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
    margin: '40px 0 20px 0px',
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
}));

const Airport = ({
  roundNumber, hasLocationSelected, selectedLocationId, previousLocationId, allLocationDetails, locations,
}) => {
  const classes = useStyles();
  const [mapValues, setMapValues] = useState({});
  // const [teamValues, setTeamValues] = useState({});
  const [valRet, setValRet] = useState(false);
  const { player, setPlayer } = useContext(userContext);
  const [selectedRadio, setSelectedRadio] = useState(previousLocationId);
  const [updatedLocation, setUpdatedLocation] = useState(false);

  const setVisitLocation = async () => {
    socket.emit('putCurrentLocation', {
      roomId: player.hostCode,
      locationId: selectedRadio,
      teamName: player.teamName,
      roundId: roundNumber,
    });
  };

  const updateLocName = useCallback(() => {
    let locName;
    Object.entries(mapValues).forEach((val) => {
      if (parseInt(val[1].cityId, 10) === selectedLocationId) {
        locName = val[1].cityName;
      }
    });
    const updatedPlayer = {
      ...player,
      currentLocation: selectedLocationId,
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
      setMapValues(data);
    }
    if (!valRet && !hasLocationSelected) {
      getMapVal();
      setValRet(true);
    }
  }, [valRet, hasLocationSelected]);

  useEffect(() => {
    if (hasLocationSelected && selectedLocationId && !updatedLocation) {
      updateLocName();
      setUpdatedLocation(true);
    }
  }, [hasLocationSelected, selectedLocationId, updateLocName, updatedLocation]);

  const updateSelectedLocation = (e) => {
    setSelectedRadio(parseInt(e.target.value, 10));
  };

  const getLocationNameById = () => {
    let result;
    Object.entries(mapValues).forEach((val) => {
      if (parseInt(val[1].cityId, 10) === previousLocationId) {
        result = val[1].cityName;
      }
    });
    return result;
  };

  return (
    <div>
      <div className={classes.root}>
        {mapValues && previousLocationId && <RoundsInfo marginTop="20px" label={`You are currently in ${getLocationNameById()}`} />}
        {!hasLocationSelected ? (
          <>
            <p style={{ marginTop: '40px' }}>Fly to : </p>
            {Object.entries(mapValues).map((items) => {
              const totalCon = items[1].allowedToVisit;
              if(!totalCon.includes(previousLocationId)) {
                totalCon.push(previousLocationId);
              }
              if (items[1].cityId === player.previousLocation) {
                return (
                  <>
                    {totalCon.map((tloc) => {
                      const obj = mapValues.find((x) => x.cityId === tloc);
                      return (
                        <div className={classes.radio} key={obj.cityId}>
                          <input
                            type="radio"
                            value={obj.cityId}
                            key={obj.cityId}
                            disabled={hasLocationSelected || (locations.filter((v) => (v == obj.cityId)).length)>=2}
                            name="location"
                            checked={parseInt(selectedRadio, 10) === parseInt(obj.cityId, 10)}
                            onChange={updateSelectedLocation}
                          />
                          {' '}
                          {obj.cityName}
                        </div>
                      );
                    })}
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
                if (mapValues[i].cityId === arg.currentLocation) {
                  ind = i;
                  break;
                }
              }
              return (
                <div className={classes.child1}>
                  <div className={classes.teammark} style={{ backgroundColor: TEAM_COLOR_MAP[arg.teamName], borderRadius: '100%' }} />
                  <div style={{ margin: 'auto', textAlign: 'center' }}>{ind !== -1 && mapValues[ind].cityName}</div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
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
