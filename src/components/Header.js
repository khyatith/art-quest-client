import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import userContext from "../global/userContext";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    margin: '0 auto',
    fontWeight: '700',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  playerdiv: {
    fontWeight: 700
  }
}));

function Header() {
  const classes = useStyles();
  const { player } = useContext(userContext);
	return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            ART QUEST
          </Typography>
          { player &&
            <div className={classes.playerdiv}>
              <p>{player.playerName}, Team {player.teamName}, {player.playerId}</p>
            </div>
          }
        </Toolbar>
      </AppBar>
    </div>
	);
}
export default Header;
