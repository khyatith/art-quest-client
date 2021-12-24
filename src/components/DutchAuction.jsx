import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Button, CardActions } from '@mui/material';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { rubberBand } from 'react-animations';
import { API_URL, TEAM_COLOR_MAP } from '../global/constants';
import SimpleRating from './Rating';
import { socket } from '../global/socket';

const useStyles = makeStyles((theme) => ({
  paintOpt: {
    backgroundColor: '#ffffff',
    textAlign: 'center',
  },
  nominateBtn: {
    backgroundColor: '#76e246',
  },
  nominateBtnDone: {
    backgroundColor: 'gray',
  },
  contentstyle: {
    textAlign: 'center',
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(5rem)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  childSel: {
    boxShadow: "5px 10px red",
  },
  expandOpen: {
    backgroundColor: '#000000',
  },
  cardStyle: {
    transition: 'width 2s',
    transitionTimingFunction: 'linear',
    animation: '$fadeIn .2s ease-in-out',
  },
  teammark: {
    height: '35px',
    width: '35px',
    borderRadius: '50%',
    display: 'inline-block',
    margin: '20px',
  },
  fontSty: {
    fontSize: 'large',
    fontWeight: '700',
    lineHeight: '24px',
    padding: '10px',
  },
  parent: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  child1: {
    flex: '0 2 100%' /* explanation below */,
    marginTop: '0.5%',
    paddingBottom: '0.5%',
  },
  child2: {
    flex: '0 2 0.15%',
    backgroundColor: '#ededed',
  },
  child3: {
    flex: '0 2 29.85%',
  },
  paper: {
    maxWidth: 600,
    marginLeft: '20%',
  },
  table: {
    maxWidth: 600,
  },
  cityData: {
    flex: '20 2 30%',
  },
  appbar: {
    backgroundColor: '#76e246',
    flexGrow: 1,
    position: 'relative',
  },
  timercontent: {
    display: 'none',
    margin: '0 auto',
    fontWeight: '700',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    color: '#051207',
    fontSize: '22px',
  },
  playerdiv: {
    fontWeight: 700,
    color: '#051207', // green color
  },
}));

function DutchAuction() {
  const classes = useStyles();
  const [paintings, setPaintings] = useState();
  const [initialPaintings, setInitialPaintings] = useState();
  const user = JSON.parse(sessionStorage.getItem('user'));
  // const { player, setPlayer } = useContext(userContext);
  // const [revenue, setRevenue] = useState(-1);
  const [nominatedPaintings, setNominatedPaintings] = useState([]);
  const [paintingTeams, setPaintingTeams] = useState({});
  const [dutchAuctionTimerValue, setDutchAuctionTimerValue] = useState();
  const [hasDutchAuctionTimerEnded, setHasDutchAuctionTimerEnded] = useState(false);
  const [priceDropSequence, setPriceDropSequence] = useState();
  const [animateChange, setAnimateChange] = useState(false);
  const [valueDrop, setValueDrop] = useState(0);
  const Bounce = styled.div`
    animation: 1.2s ${keyframes`${rubberBand}`};
  `;

  const handleSelectPainting = (index) => {
    const val = paintings[index].paintingQuality;
    const paintingId = paintings[index].id;
    socket.emit('addNewBid', {
      auctionId: paintingId,
      bidTeam: user.teamName,
      player: user,
      auctionObj: paintings,
      bidAt: +new Date(),
      paintingQuality: val,
      auctionType: '5',
      bidColor: user.teamColor,
      bidAmount: paintings[index].originalValue,
    });
  };

  const getRemainingTime = async () => {
    setAnimateChange(false);
    const total = parseInt(dutchAuctionTimerValue.total, 10) - 1000;
    const seconds = Math.floor((parseInt(total, 10) / 1000) % 60);
    const minutes = Math.floor((parseInt(total, 10) / 1000 / 60) % 60);
    if (total < 1000) {
      await axios.put(`${API_URL}/buying/updateDutchAuctionResults/${user.hostCode}`);
      setHasDutchAuctionTimerEnded(true);
    } else {
      const value = {
        total,
        minutes: minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
        seconds: seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
      };
      setDutchAuctionTimerValue(value);
      if (!hasDutchAuctionTimerEnded && seconds % 3 === 0 && !nominatedPaintings.includes(paintings[priceDropSequence[valueDrop]].id)) {
        const newValue = paintings;
        newValue[priceDropSequence[valueDrop]].originalValue = ((newValue[priceDropSequence[valueDrop]].originalValue * 9) / 10).toFixed(2);
        setPaintings(newValue);
        setAnimateChange(true);
        setValueDrop(valueDrop + 1);
      } else if (seconds % 3 === 0) {
        setValueDrop(valueDrop + 1);
      }
    }
  };

  useEffect(() => {
    if (hasDutchAuctionTimerEnded) {
      console.log('timer ended');
      // redirect to selling instructions
    }
  }, [hasDutchAuctionTimerEnded]);

  // Hooks and methods
  useEffect(() => {
    // setLoading(true);
    async function getSellingInfo() {
      const { data } = await axios.get(`${API_URL}/buying/getDutchAuctionData/${user.hostCode}`);
      const { artifacts } = data.dutchAuctions;
      setDutchAuctionTimerValue(data.dutchAuctionTimerValue);
      setPriceDropSequence(data.dutchAuctionsOrder);
      if (artifacts) {
        let tempArr = [];
        for(let i=0;i<artifacts.length;++i) {
          tempArr.push(artifacts[i].originalValue);
        }
        setInitialPaintings(tempArr);
        setPaintings(artifacts);
      }
    }
    if (!paintings) {
      getSellingInfo();
    }
  }, [user]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (dutchAuctionTimerValue) {
      const interval = setInterval(() => getRemainingTime(), 1000);
      return () => clearInterval(interval);
    }
  }, [dutchAuctionTimerValue]);

  useEffect(() => {
    socket.on('emitBidForPainting', (data) => {
      if (data.paintingId && !nominatedPaintings.includes(data.paintingId)) {
        paintingTeams[data.paintingId] = data.teamName;
        setPaintingTeams(paintingTeams);
        setNominatedPaintings((existingValues) => [data.paintingId, ...existingValues]);
      }
    });
    console.log(nominatedPaintings);
  }, [nominatedPaintings]);

  const loadCardContent = (index) => (
    <CardContent className={classes.paintOpt}>
      {initialPaintings && 
      <p style={{
        color: '#A4A4A4',
        fontWeight: '700',
        marginBottom: '20px',
        fontSize: '20px',
      }}
      >
        Opening bid: $
        {initialPaintings[index]}
        {' '}
        M
      </p>}
      {//index === priceDropSequence[valueDrop - 1] && animateChange && 
      (
      <Bounce>
        <p style={{
          color: '#000000',
          fontWeight: '700',
          marginBottom: '20px',
          fontSize: '20px',
        }}
        >
          Price reduced to: $
          {paintings[index].originalValue}
          {' '}
          M
        </p>
      </Bounce>
      )}
      {/*(index !== priceDropSequence[valueDrop - 1] || !animateChange) && (
      <p style={{
        color: '#000000',
        fontWeight: '700',
        marginBottom: '20px',
        fontSize: '20px',
      }}
      >
        Price reduced to: $
        {paintings[index].originalValue}
        {' '}
        M
      </p>
    )*/}
    </CardContent>
  );

  const loadCardSelection = (index) => (
    <CardContent className={classes.paintOpt} style={{ backgroundColor: TEAM_COLOR_MAP[paintingTeams[paintings[index].id]] }}>
      <p style={{ color: '#000000', fontWeight: '700', marginBottom: '20px' }}>
        Sold at $
        {paintings[index].originalValue}
        {' '}
        M
      </p>
      <p style={{ color: '#000000', fontWeight: '700', marginBottom: '20px' }}>
        Team Won: Team&nbsp;
        {paintingTeams[paintings[index].id]}
      </p>
    </CardContent>
  );

  return (
    <>
      <AppBar className={classes.appbar}>
        <Toolbar>
          <Typography variant="h6" className={classes.timercontent}>
            Time left :
            {' '}
            {dutchAuctionTimerValue && dutchAuctionTimerValue.minutes}
            :
            {dutchAuctionTimerValue && dutchAuctionTimerValue.seconds}
          </Typography>
          {user && (
            <div className={classes.playerdiv}>
              <p>
                {user.playerName}
                , Team&nbsp;
                {user.teamName}
                ,
                {user.playerId}
              </p>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <div className={classes.parent}>
        <Box className={classes.child1} justifyContent="center" display="flex" flexWrap="wrap">
          {paintings
            && paintings.map((arg, index) => (
              <>
              <Box
                p={1}
                sx={{
                  paddingLeft: '20px',
                  paddingRight: '20px',
                }}
                // eslint-disable-next-line no-nested-ternary
                // display={(index === priceDropSequence[valueDrop - 1] && animateChange) ? 'block' : 'none'}
              >
                <Card
                  sx={{
                    minHeight: 55,
                    minWidth: 300,
                    maxWidth: 300,
                    backgroundColor: 'white',
                    margin: 'auto',
                    marginTop: '3%',
                    boxShadow: (index === priceDropSequence[valueDrop - 1])?'rgb(255,215,0,0.9) 0px 0px 7px 9px':'none',
                  }}
                  className={classes.cardStyle}
                  disabled
                >
                  <CardMedia
                    sx={nominatedPaintings.includes(paintings[index].id) ? { height: 320, filter: 'grayscale(100%)' } : { height: 320 }}
                    component="img"
                    image={arg.imageURL}
                    alt="green iguana"
                  />
                  <CardActions className={nominatedPaintings.includes(paintings[index].id) ? classes.nominateBtnDone : classes.nominateBtn}>
                    <Button
                      size="small"
                      style={{ color: '#000000', fontWeight: 'bold', width: '100%' }}
                      className={clsx(classes.expand, {
                        [classes.expandOpen]: true,
                      })}
                      onClick={() => handleSelectPainting(index)}
                      disabled={nominatedPaintings.includes(paintings[index].id)}
                    >
                      BID
                    </Button>
                  </CardActions>
                  {!nominatedPaintings.includes(paintings[index].id) && loadCardContent(index)}
                  {nominatedPaintings.includes(paintings[index].id) && loadCardSelection(index)}
                </Card>
                <div className={classes.contentstyle}>
                  <p>Painting Quality</p>
                  <SimpleRating rating={parseFloat(arg.paintingQuality)} />
                </div>
              </Box>
              </>
            ))}
        </Box>
      </div>
    </>
  );
}

export default DutchAuction;
