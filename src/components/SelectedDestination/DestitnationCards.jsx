/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

function DestitnationCards({ teamInfo }) {
  console.log('teamInfo->', teamInfo);
  const useStyles = makeStyles(() => ({
    destination_container: {
      height: '140px',
      width: '230px',
      display: 'grid',
      gridTemplateRows: '1fr 7fr',
      // eslint-disable-next-line max-len
      filter: 'drop-shadow(0.25px 0px 0px rgba(255, 255, 255, 0.5)) drop-shadow(-0.5px 0px 0px rgba(255, 255, 255, 0.5)) drop-shadow(0px 4px 4px rgba(255, 252, 252, 0.2)) drop-shadow(0px 8px 8px rgba(255, 255, 255, 0.15))',
    },
    header: {
      backgroundColor: '#FFFFFF',
      display: 'flex',
      height: '32px',
      borderRadius: '10px 10px 0 0',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    team_list: {
      padding: '1px',
      margin: '4px',
    },
    'location_pic-container': {
      height: '100%',
      width: '100%',
      backgroundSize: 'cover',
      borderRadius: '0 0 10px 10px',
      position: 'relative',
    },
    location_name: {
      position: 'absolute',
      bottom: '-10px',
      left: '5px',
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '600',
      color: 'white',
      textShadow: '0px 4px 20px #000000',
    },
  }));
  const classes = useStyles();
  const [cityInfo, setCityInfo] = React.useState([]);
  const [cities] = React.useState(JSON.parse(sessionStorage.getItem('CITIES')));

  React.useEffect(() => {
    const foundCity = cities.find((loc) => loc.cityId === teamInfo?.locationId);
    setCityInfo(foundCity);
  }, []);
  console.log('city->', cityInfo);
  return (
    <div className={classes.destination_container}>
      <div className={classes.header}>
        { teamInfo?.team && teamInfo.team?.length > 0 && teamInfo.team.map((teamColor) => (
          <div className={classes.team_list}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM16.36 14.83C14.93 13.09 11.46 12.5 10 12.5C8.54 12.5 5.07 13.09 3.64 14.83C2.62 13.49 2 11.82 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 11.82 17.38 13.49 16.36 14.83ZM6.5 7.5C6.5 5.56 8.06 4 10 4C11.94 4 13.5 5.56 13.5 7.5C13.5 9.44 11.94 11 10 11C8.06 11 6.5 9.44 6.5 7.5Z" fill={`${teamColor.toLowerCase()}`} />
            </svg>
          </div>
        ))}

      </div>
      <div className={classes['location_pic-container']} style={{ backgroundImage: `url(${cityInfo?.cityPhoto})` }}>
        <p className={classes.location_name}>{cityInfo?.cityName}</p>
      </div>
    </div>
  );
}

export default DestitnationCards;
