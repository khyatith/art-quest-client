import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import useSessionStorage from '../hooks/useSessionStorage';

const useStyles = makeStyles((theme) => ({
  appbar: {
    height: 100,
    marginBottom: '50px',
  },
  timercontent: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    flexGrow: 1,
    textAlign: 'center',
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    marginRight: theme.spacing(2),
  },
  playercontent: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    fontSize: '22px',
    position: 'absolute',
    right: '0',
    marginRight: '10px',
  },
}));

function Header({
  player,
  landingPageTimerValue,
  auctionTimer,
  auctionResults,
}) {
  const classes = useStyles();
  //   const player = useSessionStorage('user')[0];
  return (
    <AppBar className={classes.appbar} position="static">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" className={classes.title}>
          SMART QUEST
        </Typography>
        {landingPageTimerValue && (
        <Typography className={classes.timercontent} variant="h5" noWrap>
          Auctions start in:
          {' '}
          {landingPageTimerValue.minutes}
          :
          {landingPageTimerValue.seconds}
        </Typography>
        )}
        {auctionTimer && (
        <Typography className={classes.timercontent} variant="h5" noWrap>
          {!auctionResults && (
          <>
            Time left in Auction:
            {' '}
            {auctionTimer.minutes}
            :
            {auctionTimer.seconds}
          </>
          )}
          {auctionResults && Object.keys(auctionResults).length > 0 && 'Starting next auction in 20 seconds...'}
        </Typography>
        )}
        {player && (
        <Typography variant="h6" className={classes.playercontent}>
          {player.playerName}
          ,
          {' '}
          Team
          {' '}
          {player.teamName}
        </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}
export default Header;
