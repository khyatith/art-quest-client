/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import { useHistory, useLocation } from 'react-router-dom';
import { socket } from '../global/socket';
import userContext from '../global/userContext';
import Header from './Header';
import { TEAM_DETAILS } from '../global/constants';

const useStyles = makeStyles(() => ({
  root: {
    width: 500,
    padding: 100,
    margin: '0 30%',
  },
  form: {
    margin: '0 0 20px 0px',
    width: 400,
  },
}));

function StagingScreen() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { player, setPlayer } = useContext(userContext);
  const [isAdmin, setAdmin] = useState(false);
  const [noOfTeams, setNoOfTeams] = useState(0);

  useEffect(() => {
    if (player.playerId === player.hostCode) {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  }, [player]);

  const handleClick = () => {
    socket.emit('startGame', JSON.stringify(player));
    history.push(`/game/${location.pathname.substring(9, 29)}`);
  };

  const handleChange = (event) => {
    const { value } = event.target;
    const selectedTeam = TEAM_DETAILS.filter((team) => team.id === parseInt(value, 10))[0];
    const teamColor = selectedTeam.color;
    const teamName = selectedTeam.name;
    setPlayer((prevValues) => ({ ...prevValues, teamName, teamColor }));
    sessionStorage.setItem('user', JSON.stringify(player));
  };

  const handleTeams = (event) => {
    const { value } = event.target;
    setNoOfTeams(value);
  };

  const setTeams = () => {
    socket.emit('setTeams', { teams: noOfTeams, client: player });
  };

  return (
    <>
      <Header />
      <div className={classes.root}>
        <div>
          <h1 className={classes.form}>Your game code is: {location.pathname.substring(9, 29)}</h1>
          <h1 className={classes.form}>Your UID is: {player.playerId}</h1>
          <FormControl variant="outlined" className={classes.form}>
            <InputLabel htmlFor="outlined-age-native-simple">Team Colour</InputLabel>
            <Select
              native
              onChange={handleChange}
              label="teamColours">
              <option aria-label="None" value="" />
              {
                TEAM_DETAILS.map((team) => (<option key={team.id} value={team.id}>{team.name}</option>))
              }
            </Select>
          </FormControl>
        </div>
        <form>
          <Button className={classes.form} variant="contained" color="primary" onClick={handleClick}>
            Play
          </Button>
        </form>
        {isAdmin && (
          <>
            <TextField className={classes.form} placeholder="Number Of Teams" name="numberOfTeams" variant="outlined" onChange={handleTeams} />
            <Button className={classes.form} variant="contained" color="primary" onClick={setTeams}>
              Set Teams
            </Button>
          </>
        )}
      </div>
    </>
  );
}

export default StagingScreen;
