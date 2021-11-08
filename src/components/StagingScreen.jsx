/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
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
  btnform: {
    backgroundColor: '#051207',
    margin: '0 0 20px 0px',
    width: 400,
    color: '#76e246',
    fontWeight: 700,
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
    history.push('/art-quest/instructions');
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
        </div>
        <form>
          <Button className={classes.btnform} variant="contained" color="primary" onClick={handleClick}>
            Play
          </Button>
        </form>
        {isAdmin && (
          <>
            <TextField className={classes.form} placeholder="Number Of Teams" name="numberOfTeams" variant="outlined" onChange={handleTeams} />
            <Button className={classes.btnform} variant="contained" onClick={setTeams}>
              Set Teams
            </Button>
          </>
        )}
      </div>
    </>
  );
}

export default StagingScreen;
