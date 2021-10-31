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
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

function EndBuyingPhase() {
  const classes = useStyles();
  const [artforTeams, setArtForTeams] = useState();
  const [gameWinner, setGameWinner] = useState({});
  const [totalAmountsByTeam, setTotalAmountsByTeam] = useState({});
  const [totalPointsAvgByTeam, setTotalPointsAvgByTeam] = useState({});
  const { player } = useContext(userContext);

  const getWinner = async () => {
    const { data } = await axios.get(`${API_URL}/buying/getWinner/${player.hostCode}`);
    if (data && data.leaderboard) {
      const { teamName } = player;
      const allTeamArt = data.leaderboard[teamName];
      setArtForTeams(allTeamArt);
    }
    if (data && data.winner) {
      setGameWinner(data.winner);
    }
    if (data && data.totalAmountSpentByTeam) {
      setTotalAmountsByTeam(data.totalAmountSpentByTeam);
    }
    if (data && data.totalPointsAvg) {
      setTotalPointsAvgByTeam(data.totalPointsAvg);
    }
  };

  useEffect(() => {
    if (Object.keys(gameWinner).length === 0) {
      getWinner();
    }
  }, [gameWinner]);

  const renderLeaderboardData = () => {
    const tableData = Object.entries(totalAmountsByTeam).map(([key, value]) => {
      const totalPoints = totalPointsAvgByTeam[key];
      return { key, value, totalPoints: parseFloat(totalPoints) };
    });
    const sortedData = tableData.sort((a, b) => parseFloat(b.totalPoints) - parseFloat(a.totalPoints));
    return (
      <TableContainer className={classes.paper} component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Rank</StyledTableCell>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell align="right">Total Cash Spent</StyledTableCell>
              <StyledTableCell align="right">Total Points Earned</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row, index) => (
              <TableRow key={row.key} style={{ backgroundColor: `${TEAM_COLOR_MAP[row.key]}` }}>
                <StyledTableCell align="right">
                  {parseInt(index, 10) + 1}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {row.key}
                </StyledTableCell>
                <StyledTableCell align="right">{row.value}</StyledTableCell>
                <StyledTableCell align="right">{row.totalPoints}</StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const showTeamWinner = () => {
    console.log('player', player);
    if (player.teamName.toLowerCase() === gameWinner.team.toLowerCase()) {
      return (
        <h2 style={{ backgroundColor: `${TEAM_COLOR_MAP[gameWinner.team]}`, padding: '20px', color: '#000000' }}>
          Congratulations! You are the winner!
        </h2>
      );
    }
    return (
      <h2 style={{ backgroundColor: `${TEAM_COLOR_MAP[gameWinner.team]}`, padding: '20px', color: '#000000' }}>
        The winner is
        {' '}
        Team
        {' '}
        {gameWinner.team}
      </h2>
    );
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {showTeamWinner()}
      {renderLeaderboardData()}
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
  );
}

export default EndBuyingPhase;
