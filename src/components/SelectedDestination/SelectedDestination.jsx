/* eslint-disable array-callback-return */
/* eslint-disable no-tabs */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import DestinationCards from './DestitnationCards';

const SelectedDestination = ({ player, chosenLocationForTeams, selectedLocationId }) => {
  const [location, setLocation] = useState({});
  const [otherTeamDetails, setOtherTeamDeatils] = useState({});

  const handleGetLocation = () => {
    const cities = JSON.parse(sessionStorage.getItem('CITIES'));
    const foundCity = cities.find((loc) => loc.cityId === selectedLocationId);
    setLocation(foundCity);
  };

  useEffect(() => {
    handleGetLocation();
    const otherTeams = {};
    Object.keys(chosenLocationForTeams).map((teamName) => {
      if (teamName !== player.teamName) {
        let tmp = [];
        if (otherTeams[chosenLocationForTeams[teamName].locationId]?.team) {
          tmp = [...otherTeams[chosenLocationForTeams[teamName].locationId]?.team];
        }
        console.log('tmp->', tmp);
        otherTeams[chosenLocationForTeams[teamName].locationId] = {
          locationId: chosenLocationForTeams[teamName].locationId,
          team: [...tmp,
            teamName],
        };
      }
    });
    setOtherTeamDeatils(otherTeams);
  }, [chosenLocationForTeams]);
  console.log('otherTeams->', otherTeamDetails, chosenLocationForTeams);
  return (
    <div
      style={{
        backgroundSize: 'cover',
        height: '100%',
        width: '100%',
        backgroundImage: `url(${location.cityPhoto})`,
        placeItems: 'center',
        display: 'grid',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        gridTemplateRows: '3fr 2fr',
      }}
    >
      <div style={{ color: 'white' }}>
        <h2>Welcome to the City of</h2>
        <h2 style={{ textAlign: 'center' }}>{location.cityName}</h2>
      </div>
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
      >
        <h2 style={{ color: 'white' }}> Others teams headed to:</h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '80%',
            justifyContent: 'center',
            alignItems: 'center',
            overflowX: 'hidden',
            gap: '10px',
          }}
        >
          {Object.keys(otherTeamDetails).map((otd) => (
          // <Card style={{ marginTop: '2rem' }}>
          //   <CardContent style={{}}>
          //     <p>{JSON.stringify()}</p>
          //   </CardContent>
          // </Card>
            <DestinationCards teamInfo={otherTeamDetails[otd]} />

          ))}
        </div>
      </div>
    </div>
  );
};
export default SelectedDestination;
