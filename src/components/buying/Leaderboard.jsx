/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { API_URL, STARTING_BUDGET, TEAM_COLOR_MAP } from '../../global/constants';
import buyingLeaderboardContext from '../../global/buyingLeaderboardContext';

const useStyles = makeStyles(() => ({
  paper: {
    maxWidth: '570px',
  },
  table: {
    maxWidth: '570px',
    borderCollapse: 'separate',
    borderSpacing: '2px',
    height: '6rem',
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: '7px',
  },
  body: {
    fontSize: 15,
    padding: '7px',
  },
}))(TableCell);

export default function Leaderboard({ showAuctionResults, goToNextAuctions, maxWidth }) {
  const classes = useStyles();
  const { allTeams } = JSON.parse(sessionStorage.getItem('allAuction'));
  const player = JSON.parse(sessionStorage.getItem('user'));
  const { buyingLeaderboardData, setBuyingLeaderboardData } = useContext(buyingLeaderboardContext);

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data } = await axios.get(`${API_URL}/buying/getResults/${player.hostCode}`);
      setBuyingLeaderboardData((prevValues) => ({
        ...prevValues,
        ...data,
      }));
      sessionStorage.setItem('results', JSON.stringify({ ...buyingLeaderboardData, ...data }));
    }
    if (showAuctionResults) {
      fetchLeaderboard(player);
      setTimeout(goToNextAuctions, 5000);
    }
  }, [showAuctionResults]);

  useEffect(() => {
    console.log('leaderboard useEffect buyingLeaderboardData', buyingLeaderboardData);
  }, [buyingLeaderboardData]);

  // const user = JSON.parse(sessionStorage.getItem('user'));
  const { totalAmountByTeam, totalPaintingsWonByTeams } = buyingLeaderboardData || {};
  const classifyPoints = buyingLeaderboardData?.classifyPoints?.classify;
  // if (!leaderboard) return <></>;
  return (
    <TableContainer className={classes.paper} component={Paper} style={{ margin: `${maxWidth && '0 auto'}` }}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="right">Team</StyledTableCell>
            <StyledTableCell align="right">Total Paintings</StyledTableCell>
            <StyledTableCell align="right">Cash</StyledTableCell>
            <StyledTableCell align="right">Cash points</StyledTableCell>
            {/* <StyledTableCell align="right">Visits</StyledTableCell> */}
            <StyledTableCell align="right">Classify Points</StyledTableCell>
            <StyledTableCell align="right">Total</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allTeams &&
            allTeams.map((entry) => {
              const teamName = entry;
              // starting budget(cash) = 100;
              /* eslint-disable no-nested-ternary */
              let cash = STARTING_BUDGET;
              if (totalAmountByTeam && totalAmountByTeam[teamName] >= 0) {
                cash = totalAmountByTeam[teamName];
              }
              const cashPoints = cash !== 0 ? parseFloat(cash / 10).toFixed(2) : 0;
              const classify = classifyPoints && classifyPoints[teamName] ? classifyPoints[teamName] : 0;
              const totalPaintingsWon = totalPaintingsWonByTeams && totalPaintingsWonByTeams[`${teamName}`] ? totalPaintingsWonByTeams[`${teamName}`] : 0;
              const total = (0.4 * cash + 0.3 * totalPaintingsWon + 0.3 * classify).toFixed(2);
              return (
                <TableRow key={teamName} style={{ backgroundColor: `${TEAM_COLOR_MAP[teamName]}` }}>
                  <StyledTableCell align="right">{teamName}</StyledTableCell>
                  <StyledTableCell align="right">{totalPaintingsWon}</StyledTableCell>
                  <StyledTableCell component="th" scope="row" align="right">
                    ${cash}M
                  </StyledTableCell>
                  <StyledTableCell align="right">{cashPoints}</StyledTableCell>
                  {/* <StyledTableCell align="right">0</StyledTableCell> */}
                  <StyledTableCell align="right">{classify}</StyledTableCell>
                  <StyledTableCell align="right">{total}</StyledTableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
