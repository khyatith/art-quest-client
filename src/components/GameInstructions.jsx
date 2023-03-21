import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router-dom';
// import StarIcon from '@material-ui/icons/Star';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import axios from 'axios';
import { socket } from '../global/socket';
import userContext from '../global/userContext';
import Header from './Header';
import { API_URL } from '../global/constants';
import LocationPhase from './selling/LocationPhase';

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    color: '#000000',
    textAlign: 'center',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#000000',
    marginTop: '50px',
  },
  listcontainer: {
    textAlign: 'center',
    margin: '0 auto',
    width: '50%',
  },
  listitem: {
    marginTop: '20px',
  },
  startgamebutton: {
    marginTop: '80px',
    width: '90%',
    backgroundColor: '#76e246',
    color: '#000000',
    fontWeight: '700',
    fontSize: '24px',
  },
  p: {
    fontSize: '18px',
    fontWeight: '700',
    '& span': {
      color: '#76e246',
    },
  },
  listtext: {
    '& .MuiListItemText-primary': {
      fontSize: '20px',
      fontWeight: '700',
    },
  },
}));

function GameInstructions() {
  const classes = useStyles();
  const history = useHistory();
  const [playersJoinedInfo, setPlayersJoinedInfo] = useState();
  const [version, setVersion] = useState();

  const { player, setPlayer } = useContext(userContext);

  // useEffect(() => {
  //   if (!playersJoinedInfo) {
  //     console.log('inside emit players joined info');
  //     socket.emit('getPlayersJoinedInfo', { roomCode: player.hostCode });
  //   }
  // }, []);

  const startGame = () => {
    console.log('inside start game');
    socket.emit('startGame', JSON.stringify(player));
    history.push(`/game/${player.playerId}`);
  };

  useEffect(() => {
    socket.on('numberOfPlayersJoined', (data) => {
      console.log('number of players joined', data);
      setPlayersJoinedInfo(data);
    });
  }, []);

  useEffect(() => {
    async function fetchVersion() {
      const sesStr = JSON.parse(sessionStorage.getItem('user'));
      const { data } = await axios.get(`${API_URL}/buying/getVersionID/${sesStr.hostCode}`);
      setVersion(data.version);
      const gamer = { ...player, version: data.version };
      sessionStorage.setItem('user', JSON.stringify(gamer));
      setPlayer(gamer);
    }
    if (!version) {
      fetchVersion();
    }
  }, [version]);

  useEffect(() => {
    if (playersJoinedInfo) {
      const { numberOfPlayers, playersJoined } = playersJoinedInfo;
      console.log('->', numberOfPlayers, playersJoined);
      if (numberOfPlayers <= playersJoined) {
        // === //:changed
        console.log('starting game in 15sec');
        setTimeout(() => startGame(), 15000); // 30000
      }
    }
  }, [playersJoinedInfo]);

  return (
    <>
      {version === 1 && (
        <div className={classes.container}>
          <Header />
          <p className={classes.title}>Art Quest Phase-1</p>
          <p>Welcome to ART-QUEST by KOGNITI</p>
          <p>In some time you will be taken to a painting exhibition.</p>
          <p>Your team's challenge for today is to create your favorite art collection</p>
          <h4>How will you do it?</h4>
          <p>
            By taking part in
            <h4>AUCTIONS</h4>
            and
            <h4>BIDDING</h4>
            on your favorite paintings.
          </p>
          <h3>Have fun and Good luck!</h3>
          {playersJoinedInfo && playersJoinedInfo.playersJoined !== playersJoinedInfo.numberOfPlayers && (
            <div style={{ marginTop: '20px', border: '5px solid #76e246' }}>
              <h3>
                Player
                {playersJoinedInfo.playersJoined}
                of
                {playersJoinedInfo.numberOfPlayers}
                joined. Waiting for others to join...
              </h3>
            </div>
          )}
          {playersJoinedInfo && playersJoinedInfo.playersJoined === playersJoinedInfo.numberOfPlayers && (
            <div style={{ border: '5px solid #76e246' }}>
              <h3>All players Joined. Starting game in 30 seconds ...</h3>
            </div>
          )}
          {!playersJoinedInfo && (
            <div style={{ border: '5px solid #76e246' }}>
              <h3>Waiting for players to join</h3>
            </div>
          )}
        </div>
      )}
      {version === 2 && <LocationPhase />}
    </>
  );
}

export default GameInstructions;
