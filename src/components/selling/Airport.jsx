import React, {
  useEffect, useState, useContext,
} from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import userContext from '../../global/userContext';
import { API_URL } from '../../global/constants';
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
    paddingBottom: '15%',
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
}));

const Airport = ({ roundNumber, setLocationSelectedForCurrentRound, hasLocationSelected }) => {
  const classes = useStyles();
  const [mapValues, setMapValues] = useState({});
  // const [teamValues, setTeamValues] = useState({});
  const [valRet, setValRet] = useState(false);
  const { player, setPlayer } = useContext(userContext);
  const [selectedLocation, setSelectedLocation] = useState(2);
  let locName = 'Delhi';

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
    socket.on('locationUpdatedForTeam', (data) => {
      console.log('inside socket');
      if (data.roundId === roundNumber && data.teamName === player.teamName) {
        setLocationSelectedForCurrentRound(true);
      }
    });
  });

  const updateSelectedLocation = (e) => {
    if (!hasLocationSelected) {
      console.log('inside updateSelectedLocation');
      setSelectedLocation(parseInt(e.target.value, 10));
    }
  };

  const setVisitLocation = async () => {
    if (!hasLocationSelected) {
      Object.entries(mapValues).forEach((val) => {
        if (parseInt(val[1], 10) === selectedLocation) {
          locName = val[1].cityName;
        }
      });
      setPlayer((prevValues) => ({
        ...prevValues,
        currentLocation: selectedLocation,
        currentLocationName: locName,
      }));
      // 1. update session storage
      sessionStorage.setItem('user', JSON.stringify(player));
      // 2. Send current location to api
      socket.emit('putCurrentLocation', {
        roomId: player.hostCode, locationId: selectedLocation, teamName: player.teamName, roundId: roundNumber,
      });
    }
  };

  return (
    <div>
      <div className={classes.root}>
        <RoundsInfo label={`You are currently in ${locName}`} />
        {!hasLocationSelected
          ? (
            <>
              <p style={{ marginTop: '40px' }}>Fly to : </p>
              {Object.entries(mapValues).map((items) => {
                const totalCon = items[1].allowedToVisit;
                if (items[1].cityId === player.currentLocation) {
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
                              disabled={hasLocationSelected}
                              name="location"
                              checked={parseInt(selectedLocation, 10) === parseInt(obj.cityId, 10)}
                              onChange={updateSelectedLocation}
                            />
                            {' '}
                            {obj.cityName}
                          </div>
                        );
                      })}
                    </>
                  );
                } return <></>;
              })}
            </>
          )
          : <p>You will be in your selected city after the timer ends</p>}
        <Button className={classes.btnform} variant="contained" onClick={setVisitLocation} disabled={hasLocationSelected}>
          Fly
        </Button>
      </div>
    </div>
  );
};

export default Airport;
