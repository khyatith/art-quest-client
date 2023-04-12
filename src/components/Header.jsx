import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { bounce } from 'react-animations';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { TEAM_COLOR_MAP } from '../global/constants';
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
    top: '4px',
    marginRight: '10px',
    padding: '10px',
  },
  tempBudget: {
    backgroundColor: '#87CEEB',
    padding: '10px',
  },
  addBounce: {
    animation: '$bounce 1s',
  },
  '@keyframes bounce': bounce,
}));

function Header({
  player,
  landingPageTimerValue,
  auctionTimer,
  auctionResults,
  tempBudget,
}) {
  const classes = useStyles();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  useEffect(() => {
    setShouldAnimate(true);
    setTimeout(() => setShouldAnimate(false), 1000);
  }, [tempBudget]);
  return (
    <AppBar className={classes.appbar} position="static">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" className={classes.title}>
          ART QUEST
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
        <div className={classes.playercontent}>
          <Typography variant="h6">
            {player.playerName}
            ,
            {' '}
            Team
            {' '}
            {player.teamName}
          </Typography>
          <Typography
            style={{ backgroundColor: TEAM_COLOR_MAP[player.teamName] }}
            className={`${classes.tempBudget} ${shouldAnimate ? classes.addBounce : ''}`}
          >
            {' '}
            Available Budget: $
            {tempBudget}
            {' '}
            M
          </Typography>
        </div>
        )}
      </Toolbar>
    </AppBar>
  );
}
export default Header;
