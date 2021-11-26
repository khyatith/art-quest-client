import React, {
  useEffect, useState, useCallback,
} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Button, CardActionArea, CardActions } from '@mui/material';
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
import { API_URL } from '../../global/constants';
import SimpleRating from '../Rating';

const useStyles = makeStyles((theme) => ({
  paintOpt: {
    backgroundColor: '#ffffff',
    textAlign: 'center',
  },
  nominateBtn: {
    backgroundColor: '#76e246',
  },
  contentstyle: {
    textAlign: 'center',
  },
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
      transform: "translateY(5rem)"
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)"
    }
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
    flex: '0 2 30%',
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
  // const { player, setPlayer } = useContext(userContext);
  const [otherTeams, setOtherTeams] = useState([]);
  const [expanded, setExpanded] = React.useState(-1);
  const [paintingSelected, setPaintingSelected] = React.useState(-1);
  const [selectionDone, setSelectionDone] = React.useState(false);
  const [ticketPrice, setTicketPrice] = useState();
  const [revenue, setRevenue] = useState(-1);
  const [hasTimerEnded, setTimerEnded] = useState(false);
  const [timerValue, setTimerValue] = useState();
  const history = useHistory();

  const handleExpandClick = (index) => {
    setExpanded(index);
  };

  const handleSelectPainting = (index) => {
    setPaintingSelected(index);
    setSelectionDone(true);
  };

  // Hooks and methods
  useEffect(() => {
    // setLoading(true);
    async function getSellingInfo() {
      const { data } = await axios.get(
        `${API_URL}/buying/getSellingInfo?roomId=${user.hostCode}&locationId=${user.currentLocation}&teamName=${user.teamName}`,
      );
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
  }, [user]);

  // if (loading) {
  //   return (
  //     <div style={{ marginTop: '12%', marginLeft: '43%' }}>
  //       {' '}
  //       <img src={load} alt="loading..." />
  //       {' '}
  //     </div>
  //   );
  // }

  const updateRoundIdAndRedirect = useCallback(async () => {
    // update round number and locations in session storage and context
    // call /putRoundId to update round number in rooms collection
    // redirect to landing page
    await axios.post(
      `${API_URL}/buying/updateRoundId`, { roomId: user.hostCode, roundId: user.roundId },
    );
    history.push(`/sell/location/${user.playerId}`);
  }, [user]);

  useEffect(() => {
    if (hasTimerEnded) {
      updateRoundIdAndRedirect();
    }
  }, [hasTimerEnded, updateRoundIdAndRedirect]);

  const getRemainingTime = () => {
    if (Object.keys(timerValue).length <= 0) {
      setTimerEnded(true);
      return;
    }
    const total = parseInt(timerValue.total, 10) - 1000;
    const seconds = Math.floor((parseInt(total, 10) / 1000) % 60);
    const minutes = Math.floor((parseInt(total, 10) / 1000 / 60) % 60);
    if (total < 1000) {
      setTimerEnded(true);
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

  const renderCityStats = () => {
    const { interestInArt, demand } = cityData;
    // eslint-disable-next-line no-nested-ternary
    const peopleInterestedInArt = parseInt(interestInArt, 10) < 100
      ? 'Low' : parseInt(interestInArt, 10) > 100 && parseInt(interestInArt, 10) < 200
        ? 'Medium'
        : 'High';
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
                <StyledTableCell align="right">{peopleInterestedInArt}</StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  const loadCardContent = (index) => (
    <CardContent className={classes.paintOpt}>
      <p style={{ color: '#000000', fontWeight: '700', marginBottom: '25px' }}>
        How much would you charge 1 person to see your painting in
        {' '}
        {user.currentLocationName}
        {' '}
        museum?
      </p>
      <TextField
        id="outlined-basic"
        label="Enter Ticket Price"
        variant="outlined"
        style={{ color: '#76e246', marginBottom: '20px' }}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        onChange={(e) => setTicketPrice(e.target.value)}
      />
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
        Submit ticket price for 1 person
      </Button>
    </CardContent>
  );

  const loadCardSelection = (index) => {
    const { interestInArt, demand } = cityData;
    const val = paintings[index].auctionObj.paintingQuality;
    if (revenue === -1) {
      axios
        // eslint-disable-next-line max-len
        .get(`${API_URL}/buying/calculateRevenue?roomCode=${user.hostCode}&ticketPrice=${ticketPrice}&teamName=${user.teamName}&population=${demand}&cityId=${user.currentLocationName}&paintingQuality=${val}&interestInArt=${interestInArt}`)
        .then((response) => {
          setRevenue(response.data.calculatedRevenue);
        });
    }
    return (
      <CardContent className={classes.paintOpt}>
        <Typography>You selected this painting.</Typography>
        <Typography>
          Ticket price: $
          {revenue}
        </Typography>
      </CardContent>
    );
  };

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
                , Team
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
        <div className={classes.child2} style={{ backgroundColor: user.teamColor }}>
          <p className={classes.fontSty}>
            You are in&nbsp;
            {user.currentLocationName}
          </p>
          {otherTeams.length !== 0 ? (
            <>
              <p className={classes.fontSty}>
                Other teams in&nbsp;
                {user.currentLocationName}
              </p>
              {otherTeams.map((arg) => (
                <div className={classes.teammark} style={{ backgroundColor: arg, borderRadius: '100%' }} />
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
                display={paintingSelected === -1 ? 'block' : paintingSelected === index ? 'block' : 'none'}
              >
                <Card
                  sx={{
                    minHeight: 445,
                    minWidth: 355,
                    maxWidth: 355,
                    backgroundColor: 'white',
                    margin: 'auto',
                    marginTop: '3%',
                  }}
                  className={classes.cardStyle}
                >
                  <CardActionArea>
                    <CardMedia sx={{ height: 398 }} component="img" image={arg.auctionObj.imageURL} alt="green iguana" />
                  </CardActionArea>
                  <CardActions className={classes.nominateBtn}>
                    <Button
                      size="small"
                      style={{ color: '#000000', fontWeight: 'bold', width: '100%' }}
                      className={clsx(classes.expand, {
                        [classes.expandOpen]: index === expanded,
                      })}
                      onClick={() => handleExpandClick(index)}
                      aria-expanded={index === expanded}
                      aria-label="show more"
                    >
                      Nominate
                    </Button>
                  </CardActions>
                  <Collapse in={index === expanded} timeout="auto" unmountOnExit>
                    {!selectionDone && loadCardContent(index)}
                    {selectionDone && loadCardSelection(index)}
                  </Collapse>
                </Card>
                <div className={classes.contentstyle}>
                  <p>Painting Quality</p>
                  <SimpleRating rating={parseFloat(arg.paintingQuality)} />
                </div>
              </Box>
            ))}
        </Box>
        <div className={classes.child2} style={{ backgroundColor: '#D09B69' }}>
          <div>Place where we will include Bonus Auction</div>
        </div>
      </div>
    </>
  );
}

export default ExpoBeginning;
