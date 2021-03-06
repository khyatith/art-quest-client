/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useHistory, useLocation } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import GameInstructions from './GameInstructions';
import { socket } from '../global/socket';
import userContext from '../global/userContext';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
    padding: 100,
    margin: '0 30%',
  },
  form: {
    margin: '0 0 20px 0px',
    width: 400,
  },
  btnform: {
    margin: '0 0 20px 0px',
    width: 400,
    fontWeight: 700,
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    margin: '0 auto',
  },
  appbar: {
    height: 130,
    marginBottom: '50px',
  },
}));

function StagingScreen() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { player } = useContext(userContext);
  const [isAdmin, setAdmin] = useState(false);
  const [loadInstructions, setLoadInstructions] = useState(false);
  const [noOfPlayers, setNumberOfPlayers] = useState(0);
  const [versionValue, setVersion] = React.useState(1);

  useEffect(() => {
    if (player.playerId === player.hostCode) {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  }, [player]);

  const handleClick = () => {
    setLoadInstructions(true);
  };

  const handleTeams = (event) => {
    const { value } = event.target;
    setNumberOfPlayers(value);
  };

  const handleVersion = (event) => {
    const { value } = event.target;
    setVersion(value);
  };

  const setTeams = () => {
    socket.emit('setTeams', { numberOfPlayers: noOfPlayers, roomCode: player.hostCode, version: versionValue });
  };

  return (
    <>
      <AppBar className={classes.appbar} position="static">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            ART QUEST
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.root}>
        <div>
          <h1 className={classes.form}>Your game code is: {location.pathname.substring(9, 29)}</h1>
          <h1 className={classes.form}>Your UID is: {player.playerId}</h1>
        </div>
        {/* {!isAdmin
          && (
          <form>
            <Button className={classes.btnform} variant="contained" color="primary" onClick={handleClick}>
              Play
            </Button>
          </form>
          )} */}
        {isAdmin && (
          <>
            <TextField className={classes.form} placeholder="Enter total number Of Players" name="numberOfTeams" variant="outlined" onChange={handleTeams} />
            <InputLabel>Version</InputLabel>
            <Select className={classes.form} value={versionValue} label="Version" onChange={handleVersion}>
              <MenuItem value={1}>version 1</MenuItem>
              <MenuItem value={2}>version 2</MenuItem>
              <MenuItem value={3}>version 3</MenuItem>
            </Select>
            <Button className={classes.btnform} color="primary" variant="contained" onClick={setTeams}>
              Set Details
            </Button>
          </>
        )}
      </div>
      {
        loadInstructions && <GameInstructions />
      }
    </>
  );
}

export default StagingScreen;
