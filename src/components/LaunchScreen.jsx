import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { useHistory } from 'react-router';
import { MenuItem } from '@material-ui/core';
import { socket } from '../global/socket';
import userContext from '../global/userContext';
import GameInstructions from './GameInstructions';
// import LocationPhase from './selling/LocationPhase';
import { TEAM_COLOR_MAP, API_URL } from '../global/constants';
import Header from './Header';

const useStyles = makeStyles(() => ({
  playerdiv: {
    fontWeight: 700,
    color: '#76e246', // green color
  },
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
    margin: '0 0 20px 0px',
    width: 245,
    fontWeight: 700,
  },
}));

function LaunchScreen() {
  const classes = useStyles();
  const history = useHistory();
  const [joinError, setJoinError] = useState();
  const [loadInstructions, setLoadInstructions] = useState(false);
  const { player, setPlayer } = useContext(userContext);

  const handleCreate = () => {
    const existingUser = JSON.parse(sessionStorage.getItem('user'));
    if (existingUser?.playerId === '') {
      console.log('playerId is empty. Open in new tab and enter name before continuing');
      return;
    }
    sessionStorage.setItem('user', JSON.stringify(player));
    socket.emit('createRoom', JSON.stringify(player));
    history.push(`/staging/${player.playerId}`);
  };

  useEffect(() => {
    socket.on('gameState', (newGameState) => {
      sessionStorage.setItem('allAuction', JSON.stringify(newGameState));
    });
  }, []);

  const getUID = async () => {
    console.log('getUID called');

    const { data } = await axios.get(`${API_URL}/buying/getUID/`);
    return data;
  };

  const handleChange = async (event) => {
    const { name, value } = event.target;
    if (sessionStorage.getItem('user') === null) {
      setPlayer((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
      if (player.playerId === '') {
        const uid = await getUID();
        setPlayer((prevValues) => ({
          ...prevValues,
          playerId: uid,
          hostCode: uid,
        }));
      }
    } else {
      const gamer = JSON.parse(sessionStorage.getItem('user'));
      setPlayer((prevValues) => ({
        ...prevValues,
        ...gamer,
        [name]: value,
      }));
    }
  };

  const handleTeamSelect = (event) => {
    const { value } = event.target;
    const teamColor = TEAM_COLOR_MAP[value];
    const teamName = value;
    setPlayer((prevValues) => ({ ...prevValues, teamName, teamColor }));
  };

  const handleJoin = async () => {
    const { data } = await axios.get(`${API_URL}/buying/validatePlayerId/${player.hostCode}`);
    if (data.type === 'error') {
      setJoinError(data.message);
    } else {
      setJoinError(false);
      if (sessionStorage.getItem('user') === null) {
        sessionStorage.setItem('user', JSON.stringify(player));
      }
      socket.emit('joinRoom', JSON.stringify(player));
      setLoadInstructions(true);
    }
  };

  return (
    <>
      {!loadInstructions && (
        <>
          <Header />
          <div style={{ textAlign: 'center', marginTop: '8rem' }}>
            {joinError && <h3 style={{ color: '#FF0000' }}>{joinError}</h3>}
            <div>
              <TextField className={classes.form} name="playerName" label="Player Name" variant="outlined" onChange={handleChange} />
            </div>

            <div>
              <FormControl variant="outlined" className={classes.form}>
                <InputLabel htmlFor="outlined-age-native-simple">Team Colour</InputLabel>
                <Select onChange={handleTeamSelect} label="teamColours">
                  <MenuItem style={{ height: '2rem' }} value="" />
                  {Object.entries(TEAM_COLOR_MAP).map(([key]) => (
                    <MenuItem key={key} value={key}>
                      {key}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div>
              <TextField className={classes.form} name="hostCode" label="Game Code" variant="outlined" onChange={handleChange} />
            </div>

            <Button className={classes.btnform} color="secondary" variant="contained" onClick={handleJoin}>
              Join Game
            </Button>

            <div style={{ textAlign: 'center' }}>
              <Typography>Or</Typography>
              <br />
            </div>

            <Button className={classes.btnform} color="primary" variant="contained" onClick={handleCreate}>
              Create Game
            </Button>
          </div>
        </>
      )}
      {loadInstructions && <GameInstructions />}
    </>
  );
}

export default LaunchScreen;
