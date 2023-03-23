import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Button, Container, Divider } from '@material-ui/core';

const a = 'https://firebasestorage.googleapis.com/v0/b/auctions-f601d.appspot.com/';
const b = 'o/art-movements%2Fabstract%2Fbild-no-635.webp?alt=media&token=ae360b2a-73db-4d36-9642-a6b11527d2a7';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '30%',
    position: 'absolute',
    right: '0',
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
          <Container className={classes.paintingContainer}>
            <div className={classes.painting}>
              <img className={classes.img} src={a + b} alt="painting" />
              <p>Art type</p>
            </div>
            <div className={classes.paintingDetails}>
              <p className={classes.info}>paid $10 M</p>
              <p>+5 classify points</p>
            </div>
            <Button onClick={() => handleSell()} className={classes.sellButton} variant="contained" color="primary">Sell</Button>
          </Container>
          <Divider />
          <Container className={classes.paintingContainer}>
            <div className={classes.painting}>
              <img className={classes.img} src={a + b} alt="painting" />
              <p>Art type</p>
            </div>
            <div className={classes.paintingDetails}>
              <p className={classes.info}>paid $10 M</p>
              <p>+5 classify points</p>
            </div>
            <Button onClick={() => handleSell()} className={classes.sellButton} variant="contained" color="primary">Sell</Button>
          </Container>
          <Divider />
          <Container className={classes.paintingContainer}>
            <div className={classes.painting}>
              <img className={classes.img} src={a + b} alt="painting" />
              <p>Art type</p>
            </div>
            <div className={classes.paintingDetails}>
              <p className={classes.info}>paid $10 M</p>
              <p>+5 classify points</p>
            </div>
            <Button onClick={() => handleSell()} className={classes.sellButton} variant="contained" color="primary">Sell</Button>
          </Container>
          <Divider />
          <Container className={classes.paintingContainer}>
            <div className={classes.painting}>
              <img className={classes.img} src={a + b} alt="painting" />
              <p>Art type</p>
            </div>
            <div className={classes.paintingDetails}>
              <p className={classes.info}>paid $10 M</p>
              <p>+5 classify points</p>
            </div>
            <Button onClick={() => handleSell()} className={classes.sellButton} variant="contained" color="primary">Sell</Button>
          </Container>
          <Divider />
          <Container className={classes.paintingContainer}>
            <div className={classes.painting}>
              <img className={classes.img} src={a + b} alt="painting" />
              <p>Art type</p>
            </div>
            <div className={classes.paintingDetails}>
              <p className={classes.info}>paid $10 M</p>
              <p>+5 classify points</p>
            </div>
            <Button onClick={() => handleSell()} className={classes.sellButton} variant="contained" color="primary">Sell</Button>
          </Container>
          <Divider />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
