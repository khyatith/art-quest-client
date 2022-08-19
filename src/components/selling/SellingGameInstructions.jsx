import React, { useEffect, useCallback, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Header from '../Header';
import userContext from '../../global/userContext';

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
    marginTop: '50px',
  },
  p: {
    fontSize: '18px',
  },
  pbold: {
    fontSize: '18px',
    fontWeight: '700',
  },
}));

function SellingGameInstructions() {
  const classes = useStyles();
  const { player } = useContext(userContext);

  const history = useHistory();

  const startGame = useCallback(() => {
    history.push(`/sell/location/${player.playerId}`);
  }, [player, history]);

  useEffect(() => {
    setTimeout(() => startGame(), 15000);
  }, [startGame]);

  return (
    <>
      <div className={classes.container}>
        <Header />
        <p className={classes.title}>Art Quest - Phase 2</p>
        <h3>Starting in 15 seconds ...</h3>
        <br />
        <br />
        <p className={classes.p}>Now that you have created your favorite art collection, you have to earn money from it!</p>
        <p className={classes.p}>You can travel the world and put your art for auctions to sell it to other teams.</p>
        <p className={classes.pbold}>The team with the highest total points will win</p>
        <p className={classes.p}>Good Luck!</p>
      </div>
    </>
  );
}

export default SellingGameInstructions;
