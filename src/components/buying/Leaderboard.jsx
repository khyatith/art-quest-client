import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { API_URL, TEAM_COLOR_MAP } from '../../global/constants';

const useStyles = makeStyles(() => ({
  paper: {
    maxWidth: '570px',
  },
  table: {
    maxWidth: '570px',
    borderCollapse: 'separate',
    borderSpacing: '2px',
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

export default function Leaderboard({ showAuctionResults, goToNextAuctions }) {
  const classes = useStyles();
  const { allTeams } = JSON.parse(sessionStorage.getItem('allAuction'));
  const player = JSON.parse(sessionStorage.getItem('user'));
  const existingLeaderboard = sessionStorage.getItem('results') ? JSON.parse(sessionStorage.getItem('results')) : {};
  const [leaderboardData, setLeaderboardData] = useState(existingLeaderboard);
  console.log('leaderBoardData->', leaderboardData);
  useEffect(() => {
    async function fetchLeaderboard() {
      console.log('fetching leaderboard');
      const { data } = await axios.get(`${API_URL}/buying/getResults/${player.hostCode}`);
      console.log('fetch Leaderboard res->', data);
      setLeaderboardData((prevValues) => ({
        ...prevValues,
        ...data,
      }));
      sessionStorage.setItem('results', JSON.stringify(data));
    }
    if (showAuctionResults) {
      fetchLeaderboard(player);
      setTimeout(goToNextAuctions, 5000);
    }
  }, [showAuctionResults]);
  console.log('showAuctionResults->', showAuctionResults);
  const renderLeaderboard = () => {
    const {
      totalAmountByTeam, totalPaintingsWonByTeams,
    } = leaderboardData || {};
    const classifyPoints = leaderboardData?.classifyPoints?.classify;
    // if (!leaderboard) return <></>;
    return (
      <TableContainer className={classes.paper} component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right">Team</StyledTableCell>
              <StyledTableCell align="right">Total Paintings</StyledTableCell>
              <StyledTableCell align="right">Classify Points</StyledTableCell>
              <StyledTableCell align="right">Debt</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allTeams && allTeams.map((entry) => {
              const teamName = entry;
              return (
                <TableRow key={teamName} style={{ backgroundColor: `${TEAM_COLOR_MAP[teamName]}` }}>
                  <StyledTableCell align="right">
                    {teamName}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {totalPaintingsWonByTeams && totalPaintingsWonByTeams[`${teamName}`] ? totalPaintingsWonByTeams[`${teamName}`] : 0}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {classifyPoints && classifyPoints[teamName] ? classifyPoints[teamName] : 0}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row" align="right">
                    $
                    {totalAmountByTeam && totalAmountByTeam[`${teamName}`] ? parseFloat(totalAmountByTeam[`${teamName}`]) : 0}
                    M
                  </StyledTableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div>
      {renderLeaderboard()}
    </div>
  );
}
