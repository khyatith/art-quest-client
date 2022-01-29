import React, { useContext, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Header from '../Header';
import userContext from '../../global/userContext';

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
    color: '#76e246',
    marginTop: '50px',
  },
  p: {
    fontSize: '18px',
    fontWeight: '700',
    '& span': {
      color: '#76e246',
    },
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
        <p className={classes.p}>Now that you have your favorite art collection, you have to earn money from it!</p>
        <p className={classes.p}>You can travel the world and put your art in museums in that city to collect money from it.</p>
        <p className={classes.p}>Good Luck!</p>
      </div>
    </>
  );
}

export default SellingGameInstructions;
