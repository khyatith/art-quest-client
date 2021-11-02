import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { useHistory } from 'react-router';
import { socket } from '../global/socket';
import userContext from '../global/userContext';
import Header from './Header';

const useStyles = makeStyles(() => ({
  root: {
    width: 300,
    padding: 100,
    margin: '0 30%',
  },
  form: {
    margin: '0 0 20px 0px',
    width: 245,
  },
  btnform: {
    backgroundColor: '#051207',
    margin: '0 0 20px 0px',
    width: 245,
    color: '#76e246',
    fontWeight: 700,
  },
}));

function LaunchScreen() {
  const classes = useStyles();
  const history = useHistory();
  const { player, setPlayer } = useContext(userContext);

  const handleCreate = () => {
    sessionStorage.setItem('user', JSON.stringify(player));
    socket.emit('createRoom', JSON.stringify(player));
    history.push(`/staging/${player.playerId}`);
  };

  function getRandomString(length) {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (sessionStorage.getItem('user') === null) {
      setPlayer((prevValues) => ({
        ...prevValues,
        [name]: value,
        currentLocation: 'Delhi',
      }));
      if (player.playerId === '') {
        const uid = getRandomString(6);
        setPlayer((prevValues) => ({
          ...prevValues,
          playerId: uid,
          hostCode: uid,
          currentLocation: 'Delhi',
        }));
      }
    } else {
      const gamer = JSON.parse(sessionStorage.getItem('user'));
      setPlayer((prevValues) => ({
        ...prevValues,
        ...gamer,
        [name]: value,
        currentLocation: 'Delhi',
      }));
    }
  };

  const handleJoin = () => {
    if (sessionStorage.getItem('user') === null) {
      sessionStorage.setItem('user', JSON.stringify(player));
    }
    socket.emit('joinRoom', JSON.stringify(player));
    history.push(`/staging/${player.hostCode}`);
  };

  return (
    <>
      <Header />
      <div className={classes.root}>
        <TextField className={classes.form} name="playerName" label="Player Name" variant="outlined" onChange={handleChange} />
        <Button className={classes.btnform} variant="contained" onClick={handleCreate}>
          Create Game
        </Button>
        <Typography className={classes.form}>Or</Typography>
        <TextField className={classes.form} name="hostCode" label="Game Code" variant="outlined" onChange={handleChange} />
        <Button className={classes.btnform} variant="contained" onClick={handleJoin}>
          Join Game
        </Button>
      </div>
    </>
  );
}

export default LaunchScreen;
