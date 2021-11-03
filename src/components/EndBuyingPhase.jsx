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
import userContext from '../global/userContext';
import Header from './Header';
import { API_URL, TEAM_COLOR_MAP } from '../global/constants';

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
    margin: '0 auto',
  },
  toptwoteams: {
    maxWidth: 300,
    margin: '0 auto',
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
        <h2>Results</h2>
        <TableContainer className={classes.paper} component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Rank</StyledTableCell>
                <StyledTableCell>Team</StyledTableCell>
                <StyledTableCell align="right">Debt</StyledTableCell>
                <StyledTableCell align="right">Total paintings</StyledTableCell>
                <StyledTableCell align="right">Efficiency</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={row.key} style={{ backgroundColor: `${TEAM_COLOR_MAP[row.key]}` }}>
                  <StyledTableCell align="right">
                    {parseInt(index, 10) + 1}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.teamName}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.debt}</StyledTableCell>
                  <StyledTableCell align="right">{row.totalPaintings}</StyledTableCell>
                  <StyledTableCell align="right">{row.efficiency}</StyledTableCell>
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
      console.log('inside ----');
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
      <h3>Top 2 teams are </h3>
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
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        {renderLeaderboardData()}
        {renderTopTwoTeams()}
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
