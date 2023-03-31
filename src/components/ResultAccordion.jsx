/* eslint-disable no-restricted-syntax */
import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Button, Container, Divider } from '@material-ui/core';
import buyingLeaderboardContext from '../global/buyingLeaderboardContext';
import { TEAM_COLOR_MAP } from '../global/constants';
import { fetchHashmapAndPaintingsArray } from '../global/helpers';
import TransitionsModal from './Modal';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '30%',
    position: 'absolute',
    right: '20px',
    backgroundColor: 'white',
    zIndex: '10',
  },
  headingContainer: {},
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
  const classes = useStyles();
  const { buyingLeaderboardData } = useContext(buyingLeaderboardContext);
  const player = JSON.parse(sessionStorage.getItem('user'));

  const numFromArtMovementSold = {};
  function updateNumFromArtMovementSold() {
    for (const team of Object.values(buyingLeaderboardData.leaderboard)) {
      for (const painting of team) {
        if (painting.artMovement in numFromArtMovementSold) {
          numFromArtMovementSold[painting.artMovement]++;
        } else {
          numFromArtMovementSold[painting.artMovement] = 1;
        }
      }
    }
  }
  updateNumFromArtMovementSold();

  const { paintingsArray } = fetchHashmapAndPaintingsArray(buyingLeaderboardData, player);

  function handleSell(painting) {
    console.log(buyingLeaderboardData);
    console.log(painting);
    const paintingPrice = painting.bidAmount;
    const deprecFactor = 0.05;
    const basePrice = 5;
    const marketVal = basePrice * numFromArtMovementSold[painting.artMovement];
    const adjPrice = paintingPrice - deprecFactor * paintingPrice;
    const apprecFac = (marketVal - adjPrice) / adjPrice;
    const sellingPrice = paintingPrice * deprecFactor + marketVal * apprecFac;
    console.log(sellingPrice);
  }

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className={classes.headingContainer}
          style={{ backgroundColor: TEAM_COLOR_MAP[player.teamName] }}
        >
          <Typography className={classes.heading}>
            Team
            {' '}
            {player.teamName}
            {' '}
            Paintings
          </Typography>
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
                  {painting.classifyPoint > 0 && <p>+5 classify points</p>}
                </div>
                <Button onClick={() => handleSell(painting)} className={classes.sellButton} variant="contained" color="primary">
                  Sell
                </Button>
                <TransitionsModal text="Click Yes to sell the painting" />
              </Container>
              <Divider />
            </>
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
