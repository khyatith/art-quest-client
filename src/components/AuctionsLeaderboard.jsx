import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
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

export default function AuctionsLeaderBoard({ hasAuctionTimerEnded }) {
  const classes = useStyles();
  const { player } = useContext(userContext);
  const { leaderboardData, setLeaderboardData } = useContext(leaderboardContext);

  useEffect(() => {
    async function fetchLeaderboard() {
      const sesStr = JSON.parse(sessionStorage.getItem('user'));
      const { data } = await axios.get(`${API_URL}/buying/getResults/${sesStr.hostCode}`);
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
      totalAmountByTeam, totalPaintingsWonByTeams, teamRanks,
    } = leaderboardData;
    // if (!leaderboard) return <></>;
    return (
      <TableContainer className={classes.paper} component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell align="right">Total Paintings</StyledTableCell>
              <StyledTableCell align="right">Classify Points</StyledTableCell>
              <StyledTableCell align="right">Debt</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamRanks && Object.entries(teamRanks).map((entry) => {
              const teamName = entry[0];
              return (
                <TableRow key={teamName} style={{ backgroundColor: `${TEAM_COLOR_MAP[teamName]}` }}>
                  <StyledTableCell align="right">
                    {teamName}
                  </StyledTableCell>
                  <StyledTableCell align="right">{totalPaintingsWonByTeams[`${teamName}`]}</StyledTableCell>
                  <StyledTableCell align="right">{0}</StyledTableCell>
                  {// need to replace 0 with classifyPoint
                  }
                  <StyledTableCell component="th" scope="row" align="right">
                    $
                    {parseFloat(totalAmountByTeam[`${teamName}`])}
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

AuctionsLeaderBoard.defaultProps = {
  hasAuctionTimerEnded: false,
};

AuctionsLeaderBoard.propTypes = {
  hasAuctionTimerEnded: PropTypes.bool,
};
