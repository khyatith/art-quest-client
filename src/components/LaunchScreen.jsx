import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { useHistory } from 'react-router';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { socket } from '../global/socket';
import userContext from '../global/userContext';
import { TEAM_COLOR_MAP, API_URL } from '../global/constants';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    margin: '0 auto',
    fontWeight: '700',
    color: '#76e246',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  playerdiv: {
    fontWeight: 700,
    color: '#76e246', // green color
  },
  appbar: {
    background: '#051207', // black color
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

  useEffect(() => {
    socket.on('gameState', (newGameState) => {
      sessionStorage.setItem('allAuction', JSON.stringify(newGameState));
    });
  }, []);

  const getUID = async () => {
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

  const handleTeamSelect = (event) => {
    const { value } = event.target;
    const teamColor = TEAM_COLOR_MAP[value];
    const teamName = value;
    setPlayer((prevValues) => ({ ...prevValues, teamName, teamColor }));
    // sessionStorage.setItem('user', JSON.stringify(player));
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
      <div className={classes.grow}>
        <AppBar className={classes.appbar} position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              ART QUEST
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <div className={classes.root}>
        <TextField className={classes.form} name="playerName" label="Player Name" variant="outlined" onChange={handleChange} />
        <FormControl variant="outlined" className={classes.form}>
          <InputLabel htmlFor="outlined-age-native-simple">Team Colour</InputLabel>
          <Select
            native
            onChange={handleTeamSelect}
            label="teamColours"
          >
            <option aria-label="None" value="" />
            {
              Object.entries(TEAM_COLOR_MAP).map(([key]) => (<option key={key} value={key}>{key}</option>))
            }
          </Select>
        </FormControl>
        <TextField className={classes.form} name="hostCode" label="Game Code" variant="outlined" onChange={handleChange} />
        <Button className={classes.btnform} variant="contained" onClick={handleJoin}>
          Join Game
        </Button>
        <Typography className={classes.form}>Or</Typography>
        <Button className={classes.btnform} variant="contained" onClick={handleCreate}>
          Create Game
        </Button>
      </div>
    </>
  );
}

export default LaunchScreen;
