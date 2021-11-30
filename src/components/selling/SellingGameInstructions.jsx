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
    setTimeout(() => startGame(), 10000);
  }, [startGame]);

  return (
    <>
      <div className={classes.container}>
        <Header />
        <p className={classes.title}>Art Quest</p>
        <p className={classes.p}>Now you can travel the world. You make money by putting ticket price to display your painting in the museum</p>
        <p className={classes.p}>
          Remember, you have to maximize
          {' '}
          <span>CASH</span>
          {' '}
          and
          {' '}
          <span>VISITS</span>
        </p>
        <p className={classes.p}>Let the game begin!</p>
      </div>
    </>
  );
}

export default SellingGameInstructions;
