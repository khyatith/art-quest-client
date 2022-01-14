import React, {
  useCallback,
  useEffect, useState,
} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import { Button, CardActions } from '@mui/material';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import CardContent from '@material-ui/core/CardContent';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import clsx from 'clsx';
import { TextField } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { useHistory } from 'react-router-dom';
import { API_URL, TEAM_COLOR_MAP } from '../../global/constants';
import SimpleRating from '../Rating';
import { socket } from '../../global/socket';
import { validateCurrentBid } from '../../global/helpers';
import NewBonusAuction from './NewBonusAuction';
import NewBonusAuctionResult from './NewBonusAuctionResult';

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
    flex: '0 2 70%' /* explanation below */,
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
    position: 'fixed',
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
  titlestyle: {
    backgroundColor: '#000000',
    color: '#76e246',
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 700,
    fontSize: 16,
  },
  body: {
    fontSize: 20,
    fontWeight: 700,
  },
}))(TableCell);

function ExpoBeginning() {
  const classes = useStyles();
  const [paintings, setPaintings] = useState([]);
  const [cityData, setCityData] = useState();
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [otherTeams, setOtherTeams] = useState([]);
  const [expanded, setExpanded] = React.useState(-1);
  // const ticketPrice = useRef();
  let ticketPrice = null;
  const [timerValue, setTimerValue] = useState();
  const [nominatedPaintings, setNominatedPaintings] = useState([]);
  const [paintingSelected, setPaintingSelected] = useState(-1);
  const [bidAmtError, setBidAmtError] = useState();
  const [hasSentEnglishAuctionRequest, setHasSentEnglishAuctionRequest] = useState(false);
  const [hasRevenueUpdated, setHasRevenueUpdated] = useState(false);
  const history = useHistory();

  const handleExpandClick = (index) => {
    setExpanded(index);
  };

  const handleSelectPainting = (index) => {
    if (!ticketPrice.value) {
      setBidAmtError('We encountered an error, please submit your bid again!');
      return;
    }
    const ticketVal = ticketPrice?.value;
    const isValidatedTicketVal = validateCurrentBid(ticketVal);
    if (!isValidatedTicketVal) {
      setBidAmtError('Ticket value should be within the specified range');
      return;
    }
    const { interestInArt, demand } = cityData;
    const val = paintings[index].auctionObj.paintingQuality;
    const paintingId = paintings[index].auctionId;
    socket.emit('paintingNominated', {
      paintingId,
      roomCode: user.hostCode,
      interestInArt,
      population: demand,
      cityId: user.currentLocationName,
      teamName: user.teamName,
      paintingQuality: val,
      artifactId: paintingId,
      ticketPrice: ticketVal,
      roundId: user.roundId,
      allTeamsInCity: otherTeams.length,
    });
  };

  // Hooks and methods
  useEffect(() => {
    // setLoading(true);
    async function getSellingInfo() {
      const { data } = await axios.get(`${API_URL}/buying/getSellingInfo?roomId=${user.hostCode}&locationId=${user.currentLocation}&teamName=${user.teamName}`);
      const {
        artifacts, otherteams, city, sellPaintingTimerValue,
      } = data;
      if (artifacts) {
        setPaintings(artifacts);
      }
      if (otherteams) {
        setOtherTeams(otherteams);
      }
      if (city) {
        setCityData(city);
      }
      setTimerValue(sellPaintingTimerValue);
    }
    if (!paintings || !cityData) {
      getSellingInfo();
    }
  }, [user, cityData, paintings]);

  const updateStorageWithCurrentAuction = (data) => {
    if (Object.keys(data.auctionObj).length > 0) {
      sessionStorage.setItem('currentSellingEnglishAuction', JSON.stringify(data.auctionObj));
    }
  };

  const renderEnglishAuction = useCallback(async () => {
    if (!hasSentEnglishAuctionRequest) {
      const { data } = await axios.get(`${API_URL}/buying/getEnglishAuctionForSelling?roomCode=${user.hostCode}&roundId=${user.roundId}`);
      setTimeout(() => updateStorageWithCurrentAuction(data), 5000);
    }
  }, [user]);

  useEffect(() => {
    if (!hasSentEnglishAuctionRequest) {
      renderEnglishAuction();
      setHasSentEnglishAuctionRequest(true);
    }
  }, [hasSentEnglishAuctionRequest]);

  useEffect(() => {
    socket.on('goToSellingResults', () => {
      history.push({
        pathname: `/sell/result/${user.playerId}`,
        state: nominatedPaintings,
      });
    });
  }, [user, history]);

  const getRemainingTime = async () => {
    const total = parseInt(timerValue.total, 10) - 1000;
    const seconds = Math.floor((parseInt(total, 10) / 1000) % 60);
    const minutes = Math.floor((parseInt(total, 10) / 1000 / 60) % 60);
    if (total < 1000 && !hasRevenueUpdated) {
      const currentAuctionObj = sessionStorage.getItem('currentSellingEnglishAuction');
      const obj = currentAuctionObj && JSON.parse(currentAuctionObj);
      if (obj && Object.keys(obj).length > 0) {
        await axios.post(`${API_URL}/buying/updateEnglishAuctionResults`, { roomId: user.hostCode, auctionId: obj.id });
      }
      socket.emit('expoBeginningTimerEnded', { hostCode: user.hostCode });
      setHasRevenueUpdated(true);
    } else {
      const value = {
        total,
        minutes: minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
        seconds: seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
      };
      setTimerValue(value);
    }
  };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (timerValue) {
      const interval = setInterval(() => getRemainingTime(), 1000);
      return () => clearInterval(interval);
    }
  });

  useEffect(() => {
    socket.on('emitNominatedPainting', (data) => {
      if (data.paintingId && !nominatedPaintings.includes(data.paintingId)) {
        setNominatedPaintings((existingValues) => [data.paintingId, ...existingValues]);
        if (data.teamName === user.teamName) {
          setPaintingSelected(data.paintingId);
        }
      }
    });
  }, [nominatedPaintings]);

  const renderCityStats = () => {
    const { interestInArt, demand } = cityData;
    // eslint-disable-next-line no-nested-ternary
    const intInArt = parseInt(interestInArt, 10) < 100 ? 'Low' : parseInt(interestInArt, 10) > 100 && parseInt(interestInArt, 10) < 200 ? 'Medium' : 'High';
    return (
      <>
        <h2 style={{ textAlign: 'center' }}>
          About&nbsp;
          {user.currentLocationName}
        </h2>
        <TableContainer className={classes.paper} component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="right">Population</StyledTableCell>
                <StyledTableCell align="right">Level of interest in art</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <StyledTableCell align="right">
                  {demand}
                  M
                </StyledTableCell>
                <StyledTableCell align="right">{intInArt}</StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  const loadCardContent = (index) => {
    return (
      <CardContent className={classes.paintOpt}>
        <p style={{ color: '#000000', fontWeight: '700', marginBottom: '25px' }}>
          How much would you charge 1 person to see your painting in
          {' '}
          {user.currentLocationName}
          {' '}
          museum?
        </p>
        <TextField
          id="textfield"
          inputRef={(node) => { ticketPrice = node; }}
          error={!!bidAmtError}
          helperText={bidAmtError && bidAmtError}
          label="Enter Ticket Price"
          variant="outlined"
          style={{ color: '#76e246', marginBottom: '20px' }}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <p>* Ticket price can be between $1 to $999</p>
        <Button
          size="small"
          style={{
            color: '#76e246',
            fontWeight: 'bold',
            width: '100%',
            backgroundColor: '#000000',
          }}
          onClick={() => handleSelectPainting(index)}
        >
          Submit ticket price
        </Button>
      </CardContent>
    );
  };

  const loadCardSelection = () => (
    <CardContent className={classes.paintOpt}>
      <Typography>Thank you for nominating this painting. You will see your earnings when the timer ends.</Typography>
    </CardContent>
  );

  return (
    <>
      <AppBar className={classes.appbar}>
        <Toolbar>
          <Typography variant="h6" className={classes.timercontent}>
            Time left
            {' '}
            {timerValue && timerValue.minutes}
            :
            {timerValue && timerValue.seconds}
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
        <div className={classes.child1}>{cityData && <div className={classes.cityData}>{renderCityStats()}</div>}</div>
        <div className={classes.child2} />
        <div className={classes.child3} style={{ backgroundColor: '#f9f9f9', textAlign: 'center' }}>
          <p className={classes.fontSty}>
            You are in&nbsp;
            {user.currentLocationName}
          </p>
          {otherTeams.length !== 0 ? (
            <>
              <p className={classes.fontSty}>
                All teams in&nbsp;
                {user.currentLocationName}
              </p>
              {otherTeams.map((arg) => (
                <div className={classes.teammark} style={{ backgroundColor: TEAM_COLOR_MAP[arg], borderRadius: '100%' }} />
              ))}
            </>
          ) : (
            <p className={classes.fontSty}>
              There are no other teams with you in&nbsp;
              {user.currentLocationName}
            </p>
          )}
        </div>
      </div>
      <hr style={{ border: '1px solid #ededed' }} />
      <div className={classes.parent}>
        <Box className={classes.child1} justifyContent="center" display="flex" flexWrap="wrap">
          {paintings
            && paintings.map((arg, index) => (
              <Box
                p={1}
                sx={{
                  paddingLeft: '20px',
                  paddingRight: '20px',
                }}
                // eslint-disable-next-line no-nested-ternary
                display={paintingSelected === -1 ? 'block' : paintingSelected === arg.auctionId ? 'block' : 'none'}
              >
                <Card
                  sx={{
                    minHeight: 45,
                    minWidth: 355,
                    maxWidth: 355,
                    backgroundColor: 'white',
                    margin: 'auto',
                    marginTop: '3%',
                  }}
                  className={classes.cardStyle}
                  disabled
                >
                  <CardHeader className={classes.titlestyle} title={`Bought for $${arg.bidAmount}M`} />
                  <CardMedia
                    sx={(paintingSelected === paintings[index].auctionId) ? { height: 298, filter: 'grayscale(100%)' } : { height: 298 }}
                    component="img"
                    image={arg.auctionObj.imageURL}
                    alt="green iguana"
                  />
                  <CardActions className={(paintingSelected === paintings[index].auctionId) ? classes.nominateBtnDone : classes.nominateBtn}>
                    <Button
                      size="small"
                      style={{ color: '#000000', fontWeight: 'bold', width: '100%' }}
                      className={clsx(classes.expand, {
                        [classes.expandOpen]: true,
                      })}
                      onClick={() => handleExpandClick(index)}
                      aria-expanded
                      aria-label="show more"
                      disabled={(paintingSelected === paintings[index].auctionId)}
                    >
                      Nominate painting
                    </Button>
                  </CardActions>
                  <Collapse in={index === expanded} timeout="auto" unmountOnExit>
                    {(paintingSelected === -1) && loadCardContent(expanded)}
                    {(paintingSelected === paintings[index].auctionId) && loadCardSelection()}
                  </Collapse>
                </Card>
                <div className={classes.contentstyle}>
                  <p>Painting Quality</p>
                  <SimpleRating rating={parseFloat(arg.paintingQuality)} />
                </div>
              </Box>
            ))}
        </Box>
        <div className={classes.child2} />
        <div
          className={classes.child3}
          style={{
            backgroundColor: '#f9f9f9',
            display: (timerValue && timerValue.total <= 10000) ? 'none' : 'block',
          }}
        >
          <NewBonusAuction />
        </div>
        <div
          className={classes.child3}
          style={{
            backgroundColor: '#f9f9f9',
            display: ((timerValue && timerValue.total <= 10000) ? 'block' : 'none'),
          }}
        >
          <NewBonusAuctionResult />
        </div>
      </div>
    </>
  );
}

export default ExpoBeginning;
