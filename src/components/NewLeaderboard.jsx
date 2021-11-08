import React, { useEffect, useContext } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import leaderboardContext from '../global/leaderboardContext';
import userContext from '../global/userContext';
import { API_URL, TEAM_COLOR_MAP } from '../global/constants';
import { formatNumberToCurrency } from '../global/helpers';

const useStyles = makeStyles(() => ({
  avatar: {
    height: '80px',
    width: '80px',
    left: '-20px',
  },
  title: {
    fontWeight: '700',
    marginLeft: '-20px',
  },
  inline: {
    display: 'inline',
  },
  paper: {
    maxWidth: '570px',
  },
  table: {
    maxWidth: '570px',
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 20,
  },
}))(TableCell);

export default function NewLeaderboard({ hasAuctionTimerEnded }) {
  const classes = useStyles();
  const { player } = useContext(userContext);
  const { leaderboardData, setLeaderboardData } = useContext(leaderboardContext);

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data } = await axios.get(`${API_URL}/buying/getResults/${player.hostCode}`);
      setLeaderboardData((prevValues) => ({
        ...prevValues,
        ...data,
      }));
    }
    if (hasAuctionTimerEnded) {
      fetchLeaderboard(player);
    }
  });

  const renderLeaderboard = () => {
    const {
      leaderboard, totalAmountByTeam, teamEfficiency,
    } = leaderboardData;
    // if (!leaderboard) return <></>;
    return (
      <TableContainer className={classes.paper} component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell align="right">Total Paintings</StyledTableCell>
              <StyledTableCell align="right">Debt</StyledTableCell>
              <StyledTableCell align="right">Efficiency</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard && Object.entries(leaderboard).map((entry) => {
              const teamName = entry[0];
              const teamResult = entry[1];
              return (
                <TableRow key={teamName} style={{ backgroundColor: `${TEAM_COLOR_MAP[teamName]}` }}>
                  <StyledTableCell align="right">
                    {teamName}
                  </StyledTableCell>
                  <StyledTableCell align="right">{teamResult.length}</StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {formatNumberToCurrency(parseFloat(totalAmountByTeam[`${teamName}`]))}
                  </StyledTableCell>
                  <StyledTableCell align="right">{formatNumberToCurrency(parseFloat(teamEfficiency[`${teamName}`]))}</StyledTableCell>
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
