import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import userContext from '../../global/userContext';
import { API_URL } from '../../global/constants';
import RoundsInfo from '../RoundsInfo';

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

const Airport = () => {
  const classes = useStyles();
  const [mapValues, setMapValues] = useState({});
  // const [teamValues, setTeamValues] = useState({});
  const [valRet, setValRet] = useState(false);
  const { player } = useContext(userContext);
  let loc = player.currentLocation;

  // Hooks and methods
  useEffect(() => {
    async function getMapVal() {
      const { data } = await axios.get(`${API_URL}/buying/getMap`);
      setMapValues(data);
    }
    if (!valRet) {
      getMapVal();
      setValRet(true);
    }
  }, []);

  function setVisitLocation(e) {
    loc = e.target.value;
    console.log(loc);
  }

  return (
    <div>
      <div className={classes.root}>
        <RoundsInfo label={`You are currently in ${loc}`} />
        <p style={{ marginTop: '40px' }}>Fly to : </p>
        <div className={classes.radio}>
          <input type="radio" value={player.currentLocation} name="location" onChange={setVisitLocation} />
          {' '}
          {player.currentLocation}
        </div>
        {Object.entries(mapValues).map((items) => {
          const totalCon = items[1].allowedToVisit;
          if (items[1].cityName === loc) {
            return (
              <>
                {totalCon.map((tloc) => {
                  const obj = mapValues.find((x) => x.cityId === tloc);
                  return (
                    <div className={classes.radio}>
                      <input type="radio" value={obj.cityName} name="location" onChange={setVisitLocation} />
                      {' '}
                      {obj.cityName}
                    </div>
                  );
                })}
              </>
            );
          } return <></>;
        })}
        <Button className={classes.btnform} variant="contained" onClick={setVisitLocation}>
          Fly
        </Button>
      </div>
    </div>
  );
};

export default Airport;
