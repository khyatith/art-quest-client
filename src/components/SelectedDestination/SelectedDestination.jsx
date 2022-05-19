/* eslint-disable array-callback-return */
/* eslint-disable no-tabs */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent } from '@mui/material';

const SelectedDestination = ({ player, chosenLocationForTeams, selectedLocationId }) => {
  const [location, setLocation] = useState({});
  const [otherTeamDetails, setOtherTeamDeatils] = useState({});

  const hanldeGetLocation = () => {
    const cities = JSON.parse(sessionStorage.getItem('CITIES'));
    const foundCity = cities.find((loc) => loc.cityId === selectedLocationId);
    setLocation(foundCity);
  };

  useEffect(() => {
    hanldeGetLocation();
    const otherTeams = {};
    Object.keys(chosenLocationForTeams).map((teamName) => {
      if (teamName !== player.teamName) {
        otherTeams[teamName] = {
          team: teamName,
          locationId: chosenLocationForTeams[teamName].locationId,
        };
      }
    });
    setOtherTeamDeatils(otherTeams);
  }, []);

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
      }}
    >
      <div style={{ color: 'white' }}>
        <h2>Welcome to the City of</h2>
        <h2 style={{ textAlign: 'center' }}>{location.cityName}</h2>
      </div>
      <div
        style={{
          color: 'red',
          position: 'absolute',
          marginTop: '5rem',
        }}
      >
        {Object.keys(otherTeamDetails).map((otd) => (
          <Card style={{ marginTop: '2rem' }}>
            <CardContent style={{}}>
              <p>{JSON.stringify(otherTeamDetails[otd])}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default SelectedDestination;
