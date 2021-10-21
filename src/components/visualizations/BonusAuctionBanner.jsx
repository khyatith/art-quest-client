import React from 'react';
import Paper from '@material-ui/core/Paper';
import Zoom from '@material-ui/core/Zoom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 180,
  },
  container: {
    display: 'flex',
  },
  paper: {
    margin: theme.spacing(1),
    borderColor: '#f50057',
    borderWidth: '5px',
  },
  textContainer: {
    textAlign: 'center',
    padding: '20px',
    maxWidth: '300px',
  },
}));

const BonusAuctionBanner = ({ text }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Zoom in>
          <Paper elevation={4} variant="outlined" className={classes.paper}>
            <div className={classes.textContainer}>
              <Typography variant="h5" color="secondary"> Bonus Round!!</Typography>
              <Typography variant="h5" component="p">{text && <p>{text}</p> }</Typography>
            </div>
          </Paper>
        </Zoom>
      </div>
    </div>
  );
};

export default BonusAuctionBanner;
