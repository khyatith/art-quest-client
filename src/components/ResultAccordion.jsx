/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import React, { useContext, useEffect, useState } from 'react';
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
import { socket } from '../global/socket';

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
  const { buyingLeaderboardData, setBuyingLeaderboardData } = useContext(buyingLeaderboardContext);
  const [paintings, setPaintings] = useState([]);
  const [numFromArtMovementSold, setNumFromArtMovementSold] = useState({});
  const player = JSON.parse(sessionStorage.getItem('user'));
  let { currentAuctionRound } = buyingLeaderboardData;
  if (!currentAuctionRound) currentAuctionRound = 1;
  console.log(currentAuctionRound);

  // refetch leaderboard
  useEffect(() => {
    socket.on('refetchLeaderboard', async ({ leaderBoardAfterSelling }) => {
      setBuyingLeaderboardData(leaderBoardAfterSelling);
      console.log(leaderBoardAfterSelling);
    });
  }, []);

  useEffect(() => {
    function updateNumFromArtMovementSold() {
      const x = {};
      if (!buyingLeaderboardData.leaderboard) return x;
      for (const team of Object.values(buyingLeaderboardData.leaderboard)) {
        for (const painting of team) {
          if (painting.artMovement in x) {
            x[painting.artMovement]++;
          } else {
            x[painting.artMovement] = 1;
          }
        }
      }
      return x;
    }

    const x = updateNumFromArtMovementSold();
    setNumFromArtMovementSold(x);
    const { paintingsArray } = fetchHashmapAndPaintingsArray(buyingLeaderboardData, player);
    setPaintings(paintingsArray);

    console.log('result accordion useEffect buyingLeaderboardData. paintings array len: ', paintingsArray.length);
  }, [buyingLeaderboardData]);

  async function handleSell(painting) {
    const paintingPrice = painting.bidAmount;
    const deprecFactor = 0.05 * currentAuctionRound;
    const basePrice = 5;
    const marketVal = basePrice * numFromArtMovementSold[painting.artMovement];
    const adjPrice = paintingPrice - deprecFactor * paintingPrice;
    const apprecFac = (marketVal - adjPrice) / adjPrice;
    let sellingPrice = paintingPrice * deprecFactor + marketVal * apprecFac;
    sellingPrice = 10; // above gives negative will fix later

    painting.sellingPrice = sellingPrice;
    painting.soldInRound = currentAuctionRound;

    socket.emit('sellPaintingVersion1', { painting, player });
    console.log('painting sp', sellingPrice);
    console.log('emitted sellPainting');
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
          {paintings.map((painting) => (
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
