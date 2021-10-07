import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { socket } from '../global/socket';
import userContext from '../global/userContext';

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
    fontSize: '36px',
    fontWeight: '700',
    color: '#EC40D6',
  },
  listcontainer: {
    textAlign: 'center',
    margin: '0 auto',
    width: '50%',
  },
  icon: {
    color: '#ffffff',
  },
  listtext: {
    '& .MuiListItemText-primary': {
      fontSize: '20px',
      fontWeight: '700',
    },
  },
  listnumber: {
    border: '3px solid #EC40D6',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    textAlign: 'center',
    padding: '8px',
    marginRight: '20px',
    color: '#EC40D6',
  },
  listitem: {
    marginTop: '20px',
  },
  startgamebutton: {
    marginTop: '100px',
    width: '90%',
    backgroundColor: '#0fc',
    color: '#000000',
    fontWeight: '700',
    fontSize: '24px',
  },
}));

function GameInstructions() {
  const classes = useStyles();
  const history = useHistory();
  const { player } = useContext(userContext);

  const handleClick = () => {
    socket.emit('startGame', JSON.stringify(player));
    history.push(`/game/${player.playerId}`);
  };

  return (
    <div className={classes.container}>
      <p className={classes.title}>Art Quest</p>
      <List className={classes.listcontainer} dense>
        <ListItem className={classes.listitem}>
          <div className={classes.listnumber}>
            <h2 style={{ top: '-15px', position: 'relative' }}>1</h2>
          </div>
          <ListItemText className={classes.listtext} primary="Create your favorite art collection" />
        </ListItem>
        <ListItem className={classes.listitem}>
          <div className={classes.listnumber}>
            <h2 style={{ top: '-15px', position: 'relative' }}>2</h2>
          </div>
          <ListItemText className={classes.listtext} primary="Spend the least gold" />
        </ListItem>
        <ListItem className={classes.listitem}>
          <div className={classes.listnumber}>
            <h2 style={{ top: '-15px', position: 'relative' }}>2</h2>
          </div>
          <ListItemText className={classes.listtext} primary="Collect most number of paintings" />
        </ListItem>
      </List>
      <Button className={classes.startgamebutton} variant="contained" color="primary" onClick={handleClick}>
        Start Game
      </Button>
    </div>
  );
}

export default GameInstructions;
