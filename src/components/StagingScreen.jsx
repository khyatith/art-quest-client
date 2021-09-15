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
  }, []);

  useEffect(() => {
    socket.on('updatedLeaderBoard', (updatedLeaderBoard) => {
      console.log(updatedLeaderBoard);
    });
  }, []);

  const handleClick = () => {
    socket.emit('startGame', JSON.stringify(player));
    history.push(`/game/${location.pathname.substring(9, 29)}`);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPlayer((prevValues) => ({ ...prevValues, [name]: value }));
    sessionStorage.setItem('user', JSON.stringify(player));
  };

  const handleTeams = (event) => {
    const { name, value } = event.target;
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
              label="teamColours"
              inputProps={{
                name: 'teamName',
                id: 'outlined-age-native-simple',
              }}>
              <option aria-label="None" value="" />
              <option value="Blue">Blue</option>
              <option value="Red">Red</option>
              <option value="Green">Green</option>
              <option value="Yellow">Yellow</option>
              <option value="Purple">Purple</option>
              <option value="Orange">Orange</option>
              <option value="Indigo">Indigo</option>
              <option value="White">White</option>
              <option value="Black">Black</option>
              <option value="Gold">Gold</option>
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
