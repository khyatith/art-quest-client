/* eslint-disable array-callback-return */
/* eslint-disable no-tabs */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Card, CardMedia, CardContent } from '@mui/material';

const SelectedDestination = ({ player, chosenLocationForTeams, selectedLocationId }) => {
  const [location, setLocation] = useState({});
  const [otherTeamDetails, setOtherTeamDeatils] = useState({});

  const hanldeGetLocation = () => {
    const cities = JSON.parse(sessionStorage.getItem('CITIES'));
    const foundCity = cities.find((loc) => loc.cityId === selectedLocationId);
    setLocation(foundCity);
  };

  useState(() => {
    hanldeGetLocation();
    const otherTeams = {}; // this contains the team name other than the current team
    // and the location id of the visited by it
    Object.keys(chosenLocationForTeams).map((teamName) => {
      if (teamName !== player.teamName) {
        otherTeams[teamName].push({
          team: teamName,
          locationId: chosenLocationForTeams[teamName].locationId,
        });
      }
    });
    setOtherTeamDeatils(otherTeams);
    // console.log(chosenLocationForTeams);
    // console.log(player);
    // console.log(otherTeams);
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${location?.cityPhoto})`,
        backgroundSize: 'cover',
        height: '100%',
        width: '100%',
      }}
    >
      <div>
        {Object.keys(otherTeamDetails).map((otd) => (
          <Card>
            <CardContent style={{ color: 'white' }}>
              <p>{JSON.stringify(otherTeamDetails[otd])}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default SelectedDestination;
