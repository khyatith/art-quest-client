/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-one-expression-per-line */
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
import PaintingsShowcase from './PaintingsShowcase';

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
  // const { allTeams } = JSON.parse(sessionStorage.getItem('allAuction'));
  const allTeams = ['Blue', 'Red', 'Yellow'];
  const player = JSON.parse(sessionStorage.getItem('user'));
  const existingLeaderboard = sessionStorage.getItem('results') ? JSON.parse(sessionStorage.getItem('results')) : {};
  const [leaderboardData, setLeaderboardData] = useState(existingLeaderboard);
  useEffect(() => {
    async function fetchLeaderboard() {
      const { data } = await axios.get(`${API_URL}/buying/getResults/${player.hostCode}`);
      setLeaderboardData((prevValues) => ({
        ...prevValues,
        ...data,
      }));
      sessionStorage.setItem('results', JSON.stringify(data));
    }
    if (showAuctionResults) {
      fetchLeaderboard(player);
      setTimeout(goToNextAuctions, 20000);
    }
  }, [showAuctionResults]);

  const renderLeaderboard = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const { totalAmountByTeam, totalPaintingsWonByTeams, leaderboard } = leaderboardData || {};
    const classifyPoints = leaderboardData?.classifyPoints?.classify;
    // if (!leaderboard) return <></>;
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          alignContent: 'flex-start',
        }}>
        <div>
          <TableContainer className={classes.paper} component={Paper} style={{ margin: `${maxWidth && '0 auto'}` }}>
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
                {allTeams &&
                  allTeams.map((entry) => {
                    const teamName = entry;
                    return (
                      <TableRow key={teamName} style={{ backgroundColor: `${TEAM_COLOR_MAP[teamName]}` }}>
                        <StyledTableCell align="right">{teamName}</StyledTableCell>
                        <StyledTableCell align="right">
                          {totalPaintingsWonByTeams && totalPaintingsWonByTeams[`${teamName}`] ? totalPaintingsWonByTeams[`${teamName}`] : 0}
                        </StyledTableCell>
                        <StyledTableCell align="right">{classifyPoints && classifyPoints[teamName] ? classifyPoints[teamName] : 0}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" align="right">
                          ${totalAmountByTeam && totalAmountByTeam[`${teamName}`] ? parseFloat(totalAmountByTeam[`${teamName}`]) : 0}M
                        </StyledTableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div>{leaderboard && <PaintingsShowcase leaderboard={leaderboard[user.teamName]} />}</div>
      </div>
    );
  };

  return <div>{renderLeaderboard()}</div>;
}
