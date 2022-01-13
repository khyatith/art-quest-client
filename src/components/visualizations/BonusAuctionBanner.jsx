import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Zoom from '@material-ui/core/Zoom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
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
    padding: '18px',
    maxWidth: '400px',
  },
}));

const BonusAuctionBanner = ({ text }) => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.container}>
        <Zoom in>
          <Paper elevation={4} variant="outlined" className={classes.paper}>
            <div className={classes.textContainer}>
              <Typography variant="h5" color="secondary"> Secret Auction Round!!</Typography>
              <Typography variant="h5" component="p">{text && <p>{text}</p> }</Typography>
            </div>
          </Paper>
        </Zoom>
      </div>
    </div>
  );
};

BonusAuctionBanner.propTypes = {
  text: PropTypes.string.isRequired,
};

export default BonusAuctionBanner;
