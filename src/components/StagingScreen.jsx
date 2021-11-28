/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-one-expression-per-line */
import React, {
  useContext, useEffect, useState,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useHistory, useLocation } from 'react-router-dom';
import GameInstructions from './GameInstructions';
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
  const { player } = useContext(userContext);
  const [isAdmin, setAdmin] = useState(false);
  const [loadInstructions, setLoadInstructions] = useState(false);
  const [playersJoinedInfo, setPlayersJoinedInfo] = useState();
  const [noOfPlayers, setNumberOfPlayers] = useState(0);

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

  const setTeams = () => {
    socket.emit('setTeams', { numberOfPlayers: noOfPlayers, roomCode: player.hostCode });
  };

  useEffect(() => {
    socket.on('numberOfPlayersJoined', (data) => {
      setPlayersJoinedInfo(data);
    });
  });

  return (
    <>
      { !loadInstructions && (
      <>
        <Header />
        <div className={classes.root}>
          <div>
            <h1 className={classes.form}>Your game code is: {location.pathname.substring(9, 29)}</h1>
            <h1 className={classes.form}>Your UID is: {player.playerId}</h1>
          </div>
          {!isAdmin
            && (
            <form>
              <Button className={classes.btnform} variant="contained" color="primary" onClick={handleClick}>
                Play
              </Button>
            </form>
            )}
          {isAdmin && (
          <>
            <TextField className={classes.form} placeholder="Enter total number Of Players" name="numberOfTeams" variant="outlined" onChange={handleTeams} />
            <Button className={classes.btnform} variant="contained" onClick={setTeams}>
              Set number of players
            </Button>
          </>
          )}
        </div>
      </>
      )}
      {
        loadInstructions && <GameInstructions playersJoinedInfo={playersJoinedInfo} />
      }
    </>
  );
}

export default StagingScreen;
