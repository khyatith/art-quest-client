import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Button, Container, Divider } from '@material-ui/core';
import buyingLeaderboardContext from '../global/buyingLeaderboardContext';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '30%',
    position: 'absolute',
    right: '20px',
    backgroundColor: 'white',
    zIndex: '10',
  },
  headingContainer: {
    backgroundColor: '#87CEEB',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  paintingsContainer: {
    height: '100vh',
    overflowY: 'scroll',
    display: 'flex',
    flexDirection: 'column',
  },
  paintingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '6em',
  },
  painting: {
    display: 'flex',
    flexDirection: 'column',
  },
  img: {
    marginTop: '15px',
    height: '60px',
    objectFit: 'contain',
    marginBottom: '-15px',
  },
  paintingDetails: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 10px',
  },
  info: {
    marginBottom: '-10px',
  },
  sellButton: {
    height: '20px',
  },
}));

export default function ResultAccordion() {
  const { buyingLeaderboardData } = useContext(buyingLeaderboardContext);
  console.log(buyingLeaderboardData);
  const player = JSON.parse(sessionStorage.getItem('user'));
  let paintingsArray = [];
  if (buyingLeaderboardData.leaderboard && buyingLeaderboardData.leaderboard[player.teamName]) {
    paintingsArray = buyingLeaderboardData.leaderboard[player.teamName];
  }
  console.log(paintingsArray);
  const classes = useStyles();

  function handleSell() {}

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className={classes.headingContainer}
        >
          <Typography className={classes.heading}>Team Blue Results</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.paintingsContainer}>
          {paintingsArray.map((painting) => (
            <>
              <Container className={classes.paintingContainer}>
                <div className={classes.painting}>
                  <img className={classes.img} src={painting.imageURL} alt="painting" />
                  <p>{painting.artMovement}</p>
                </div>
                <div className={classes.paintingDetails}>
                  <p className={classes.info}>
                    paid $
                    {painting.bidAmount}
                    {' '}
                    M
                  </p>
                  <p>+5 classify points</p>
                </div>
                <Button onClick={() => handleSell()} className={classes.sellButton} variant="contained" color="primary">Sell</Button>
              </Container>
              <Divider />
            </>

          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
