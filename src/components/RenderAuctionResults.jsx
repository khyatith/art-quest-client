import React, { useEffect, useState, useContext } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import auctionContext from '../global/auctionContext';
import { API_URL, TEAM_COLOR_MAP } from '../global/constants';
import { socket } from '../global/socket';

const useStyles = makeStyles((theme) => ({
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
  cardroot: {
    flex: '0 1 25%',
  },
  root: {
    flex: '0 1 33%',
  },
  paper1: {
    marginLeft: '10%',
    flex: '0 1 33%',
    height: '100%',
    marginRight: '5%',
  },
  paper: {
    marginLeft: '10%',
    flex: '0 1 33%',
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: '20px',
    fontWeight: '700',
  },
  body: {
    fontSize: 20,
  },
}))(TableCell);

const RenderAuctionResults = ({ getNextAuctionObj }) => {
  const classes = useStyles();
  const player = JSON.parse(sessionStorage.getItem('user'));
  const [auctionResultTimer, setAuctionResultTimer] = useState();
  const [auctionResult, setAuctionResult] = useState();
  const [auctionMaxBids, setAuctionMaxBids] = useState();
  const [hasResultRequested, setHasResultRequested] = useState(false);
  const [auctionWinner, setAuctionWinner] = useState();
  const { currentAuctionData } = useContext(auctionContext);

  const getRemainingTime = () => {
    const total = parseInt(auctionResultTimer.total, 10) - 1000;
    const seconds = Math.floor((parseInt(total, 10) / 1000) % 60);
    const minutes = Math.floor((parseInt(total, 10) / 1000 / 60) % 60);
    if (total < 1000) {
      socket.emit('auctionResultTimerEnded', { player, auctionId: currentAuctionData.currentAuctionObj.id });
    } else {
      const value = {
        total,
        minutes: minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
        seconds: seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
      };
      setAuctionResultTimer(value);
    }
  };

  useEffect(() => {
    async function getAuctionResult() {
      const { auctionType, id } = currentAuctionData.currentAuctionObj;
      const url = `${API_URL}/buying/getAuctionResults/${player.hostCode}/${id}/${auctionType}`;
      const { data } = await axios.get(url);
      const {
        result,
        auctionResultTimerValue,
        winner,
        maxBids,
      } = data;
      setAuctionResultTimer(auctionResultTimerValue);
      setAuctionResult(result);
      setAuctionMaxBids(maxBids);
      setAuctionWinner(winner);
    }
    if (!hasResultRequested) {
      getAuctionResult();
      setHasResultRequested(true);
    }
  });

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (auctionResultTimer) {
      const interval = setInterval(() => getRemainingTime(), 1000);
      return () => clearInterval(interval);
    }
  });

  useEffect(() => {
    socket.on('goToNextAuction', (auctionId) => {
      getNextAuctionObj(auctionId);
    });
  });

  const renderAuctionMaxBids = () => (
    <TableContainer className={classes.paper1} component={Paper}>
      <Table aria-label="auctions result table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Team</StyledTableCell>
            <StyledTableCell align="left">Max bids by teams</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {auctionMaxBids
            && auctionMaxBids.map((entry) => {
              const { bidTeam, bidAmount } = entry || {};
              return (
                <TableRow key={bidTeam} style={{ backgroundColor: `${TEAM_COLOR_MAP[bidTeam]}` }}>
                  { bidTeam && <StyledTableCell align="left">{bidTeam}</StyledTableCell> }
                  { bidAmount
                  && (
                  <StyledTableCell align="left">
                    $
                    {bidAmount}
                    M
                  </StyledTableCell>
                  )}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderWinnerCard = () => (
    <Card className={classes.cardroot}>
      {auctionWinner
      && (
        <CardHeader
          style={{ backgroundColor: TEAM_COLOR_MAP[auctionWinner.team] }}
          title={`Team ${auctionWinner.team} won, for: $${auctionWinner.bid}M`}
        />
      )}
      <CardActionArea>
        <CardMedia component="img" image={currentAuctionData.currentAuctionObj.imageURL} title={currentAuctionData.currentAuctionObj.name} />
      </CardActionArea>
    </Card>
  );

  const setAuctionResults = () => {
    if (!auctionResult || auctionResult.length === 0) {
      return (
        <div>
          <h3>No bids were placed for this round</h3>
        </div>
      );
    }
    return (
      <>
        { auctionResult[0]
        && (
        <div className={classes.root}>
          <TableContainer className={classes.paper} component={Paper}>
            <Table aria-label="auctions result table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Team</StyledTableCell>
                  <StyledTableCell align="left">Bids</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auctionResult
                  && auctionResult.map((entry) => {
                    const { bidTeam, bidAmount } = entry || {};
                    return (
                      <TableRow key={bidTeam} style={{ backgroundColor: `${TEAM_COLOR_MAP[bidTeam]}` }}>
                        { bidTeam && <StyledTableCell align="left">{bidTeam}</StyledTableCell> }
                        { bidAmount
                        && (
                        <StyledTableCell align="left">
                          $
                          {bidAmount}
                          M
                        </StyledTableCell>
                        )}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        )}
      </>
    );
  };

  return (
    <div>
      <AppBar className={classes.appbar}>
        <Toolbar>
          <Typography variant="h6" className={classes.timercontent}>
            Next auction starting in
            {' '}
            {auctionResultTimer && auctionResultTimer.minutes}
            :
            {auctionResultTimer && auctionResultTimer.seconds}
          </Typography>
          {player && (
            <div className={classes.playerdiv}>
              <p>
                {player.playerName}
                , Team
                {player.teamName}
                ,
                {player.playerId}
              </p>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <h3 style={{ marginTop: '10%', textAlign: 'center' }}>
        Round&nbsp;
        {currentAuctionData.currentAuctionObj.id}
        &nbsp;
        result
      </h3>
      <div style={{ display: 'flex', marginTop: '5%', marginLeft: '5%' }}>
        {auctionWinner
        && (
          renderWinnerCard()
        )}
        {auctionResult && auctionResult.length > 0 ? (
          setAuctionResults()
        ) : (
          <div style={{ margin: '25%', textAlign: 'center' }}>
            <h2>No bids were placed for this round</h2>
          </div>
        )}
        {auctionMaxBids && auctionMaxBids.length > 0
        && (
          renderAuctionMaxBids()
        )}
      </div>
    </div>
  );
};

export default RenderAuctionResults;
