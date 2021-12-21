import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router-dom';
import StarIcon from '@material-ui/icons/Star';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { socket } from '../global/socket';
import userContext from '../global/userContext';
import Header from './Header';
// import LocationPhase from './selling/LocationPhase';

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    position: 'absolute',
    color: '#ffffff',
    textAlign: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#76e246',
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

  const { player } = useContext(userContext);

  const startGame = () => {
    console.log('inside start game');
    socket.emit('startGame', JSON.stringify(player));
    history.push(`/game/${player.playerId}`);
  };

  // // // IMPORTANT (KOGNITI CHANGE)

  // useEffect(() => {
  //   socket.emit('getPlayersJoinedInfo', { roomCode: player.hostCode });
  // });

  useEffect(() => {
    socket.on('numberOfPlayersJoined', (data) => {
      console.log('data', data);
      setPlayersJoinedInfo(data);
    });
  });

  useEffect(() => {
    if (playersJoinedInfo) {
      const { numberOfPlayers, playersJoined } = playersJoinedInfo;
      if (numberOfPlayers <= playersJoined) {
        setTimeout(() => startGame(), 20000);
      }
    }
  }, [playersJoinedInfo]);

  return (
    <>
      <div className={classes.container}>
        <Header />
        <p className={classes.title}>Instructions</p>
        <p className={classes.p}>Your challenge, should you choose to accept it, is to create your favorite art collection.</p>
        <p className={classes.p}>
          How will you do it? By taking part in
          {' '}
          <span>AUCTIONS</span>
          {' '}
          and by putting
          {' '}
          <span>BIDS</span>
          {' '}
          on your favorite art pieces.
        </p>
        <List className={classes.listcontainer} dense>
          <ListItem className={classes.listitem}>
            <ListItemIcon>
              <StarIcon style={{ color: '#76e246' }} />
            </ListItemIcon>
            <ListItemText className={classes.listtext} primary="Create your FAVORITE art collection" />
          </ListItem>
          {/* <ListItem className={classes.listitem}>
            <ListItemIcon>
              <StarIcon style={{ color: '#76e246' }} />
            </ListItemIcon>
            <ListItemText className={classes.listtext} primary="Spend your cash WISELY" />
          </ListItem> */}
          <ListItem className={classes.listitem}>
            <ListItemIcon>
              <StarIcon style={{ color: '#76e246' }} />
            </ListItemIcon>
            <ListItemText className={classes.listtext} primary="MAXIMIZE total number of paintings, MINIMIZE efficiency" />
          </ListItem>
        </List>
        <p className={classes.p}>Let the bidding wars begin!</p>
        { playersJoinedInfo && (playersJoinedInfo.playersJoined !== playersJoinedInfo.numberOfPlayers)
          ? (
            <div style={{ border: '5px solid #76e246' }}>
              <h3>
                Player
                {' '}
                {playersJoinedInfo.playersJoined}
                {' '}
                of
                {' '}
                {playersJoinedInfo.numberOfPlayers}
                {' '}
                joined. Waiting for others to join...
              </h3>
            </div>
          ) : (
            <div style={{ border: '5px solid #76e246' }}>
              <h3>All players Joined. Starting game ...</h3>
            </div>
          )}
      </div>
      {/* <LocationPhase /> */}
    </>
  );
}

export default GameInstructions;
