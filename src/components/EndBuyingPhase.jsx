import React, { useEffect, useState, useContext } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import userContext from '../global/userContext';
import Header from './Header';
import { API_URL, TEAM_COLOR_MAP } from '../global/constants';
import { formatNumberToCurrency } from '../global/helpers';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '40px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  table: {
    maxWidth: 700,
  },
  paper: {
    maxWidth: 700,
  },
  toptwoteams: {
    maxWidth: 300,
  },
  maingrid: {
    padding: '20px 40px 20px 40px',
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 20,
    fontWeight: 700,
  },
}))(TableCell);

function EndBuyingPhase() {
  const classes = useStyles();
  const [artforTeams, setArtForTeams] = useState();
  const [gameWinner, setGameWinner] = useState();
  const [teamEfficiency, setTeamEfficiency] = useState({});
  const [topTwoTeams, setTopTwoTeams] = useState({});
  const [totalDebtByTeam, setTotalDebtByTeam] = useState({});
  const [sortedTeamsByPaintingsWon, setSortedTeamsByPaintingsWon] = useState({});
  const [avgPaintingQualityByTeam, setAvgPaintingQualityByTeam] = useState({});
  const [showWinner, setShowWinner] = useState(false);
  const { player } = useContext(userContext);

  const getWinner = async () => {
    const { data } = await axios.get(`${API_URL}/buying/getWinner/${player.hostCode}`);
    if (data && data.leaderBoard) {
      const { teamName } = player;
      const allTeamArt = data.leaderBoard[teamName];
      setArtForTeams(allTeamArt);
    }
    if (data && data.winner) {
      setGameWinner(data.winner);
    }
    if (data && data.avgPaintingQualityByTeam && Object.keys(data.avgPaintingQualityByTeam).length !== 0) {
      setAvgPaintingQualityByTeam(data.avgPaintingQualityByTeam);
    }
    if (data && data.topTwo) {
      setTopTwoTeams(data.topTwo);
    }
    if (data && data.teamEfficiency) {
      setTeamEfficiency(data.teamEfficiency);
    }
    if (data && data.sortedObjByPaintingsWon) {
      setSortedTeamsByPaintingsWon(data.sortedObjByPaintingsWon);
    }
    if (data && data.totalAmountSpentByTeam) {
      setTotalDebtByTeam(data.totalAmountSpentByTeam);
    }
  };

  useEffect(() => {
    if (!gameWinner) {
      getWinner();
    }
  }, [gameWinner]);

  const renderLeaderboardData = () => {
    const tableData = Object.entries(sortedTeamsByPaintingsWon).map(([key, value]) => {
      const teamName = key;
      return {
        teamName, debt: totalDebtByTeam[teamName], totalPaintings: value, efficiency: teamEfficiency[teamName],
      };
    });
    return (
      <>
        <h2 style={{ textAlign: 'center' }}>All teams</h2>
        <TableContainer className={classes.paper} component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Team</StyledTableCell>
                <StyledTableCell align="right">Total paintings</StyledTableCell>
                { Object.keys(avgPaintingQualityByTeam).length > 0 && <StyledTableCell align="right">Average painting quality</StyledTableCell>}
                <StyledTableCell align="right">Debt</StyledTableCell>
                <StyledTableCell align="right">Efficiency</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.key} style={{ backgroundColor: `${TEAM_COLOR_MAP[row.key]}` }}>
                  <StyledTableCell component="th" scope="row">
                    {row.teamName}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.totalPaintings}</StyledTableCell>
                  { Object.keys(avgPaintingQualityByTeam).length > 0
                  && <StyledTableCell align="right">{ parseFloat(avgPaintingQualityByTeam[row.teamName]) }</StyledTableCell>}
                  <StyledTableCell align="right">{formatNumberToCurrency(parseFloat(row.debt))}</StyledTableCell>
                  <StyledTableCell align="right">{formatNumberToCurrency(parseFloat(row.efficiency))}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  const showTeamWinner = () => {
    const { teamName } = player;
    if (teamName === gameWinner) {
      return (
        <h2 style={{ backgroundColor: '#000000', padding: '20px', color: '#76e246' }}>
          Congratulations! You are the winner!
        </h2>
      );
    }
    return (
      <h2 style={{ backgroundColor: '#000000', padding: '20px', color: '#76e246' }}>
        The winner is
        {' '}
        Team
        {' '}
        {gameWinner}
      </h2>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setShowWinner(true);
    }, 5000);
  });

  const renderTopTwoTeams = () => (
    <>
      <h2 style={{ textAlign: 'center' }}>Top 2 teams</h2>
      <TableContainer className={classes.toptwoteams} component={Paper}>
        <Table className={classes.toptwoteams} aria-label="customized table">
          <TableBody>
            {Object.entries(topTwoTeams).map(([key]) => (
              <TableRow key={key} style={{ backgroundColor: `${TEAM_COLOR_MAP[key]}` }}>
                <StyledTableCell align="center">
                  Team
                  {' '}
                  {key}
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  return (
    <>
      <Header />
      <Grid className={classes.maingrid} container spacing={2}>
        <Grid item xs={8}>
          {renderLeaderboardData()}
        </Grid>
        <Grid item xs={2}>
          <span style={{ fontSize: '50px' }}>&#8594;</span>
        </Grid>
        <Grid item xs={2}>
          {renderTopTwoTeams()}
        </Grid>
      </Grid>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        {!showWinner && <h2>And the winner is ....</h2>}
        {showWinner && showTeamWinner()}
        <h3>Your art collection</h3>
        <div className={classes.root}>
          <ImageList rowHeight={300} className={classes.imageList}>
            {
              artforTeams
              && artforTeams.map((item) => {
                const { auctionObj } = item;
                return (
                  <ImageListItem key={item.auctionId}>
                    <img key={item.auctionId} src={auctionObj.imageURL} alt={auctionObj.name} />
                  </ImageListItem>
                );
              })
            }
          </ImageList>
        </div>
      </div>
    </>
  );
}

export default EndBuyingPhase;
