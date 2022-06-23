import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import useSessionStorage from '../hooks/useSessionStorage';

const useStyles = makeStyles((theme) => ({
  title: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    marginRight: theme.spacing(2),
  },
  appbar: {
    height: 130,
    marginBottom: '50px',
  },
}));

function Header() {
  const classes = useStyles();
  //   const player = useSessionStorage('user')[0];
  return (
    <AppBar className={classes.appbar} position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          ART QUEST
        </Typography>
        {/* { player
          && (
          <div className={classes.playerdiv}>
            <p>
              {player?.playerName}
              , Team&nbsp;
              {player?.teamName}
              ,
              {' '}
              {player?.playerId}
            </p>
          </div>
          )} */}
      </Toolbar>
    </AppBar>
  );
}
export default Header;
