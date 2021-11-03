import React, { useEffect, useContext } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
// import Box from '@material-ui/core/Box';
// import Drawer from '@material-ui/core/Drawer';
// import Avatar from '@material-ui/core/Avatar';
// import Toolbar from '@material-ui/core/Toolbar';
// // import List from '@material-ui/core/List';
// import Typography from '@material-ui/core/Typography';
// import Divider from '@material-ui/core/Divider';
// import ListItemText from '@material-ui/core/ListItemText';
// import ListSubheader from '@material-ui/core/ListSubheader';
// import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import fontawesome from '@fortawesome/fontawesome';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
              <StyledTableCell>Debt</StyledTableCell>
              <StyledTableCell align="right">Total Paintings</StyledTableCell>
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
                  <StyledTableCell component="th" scope="row">
                    {totalAmountByTeam[`${teamName}`]}
                  </StyledTableCell>
                  <StyledTableCell align="right">{teamResult.length}</StyledTableCell>
                  <StyledTableCell align="right">{teamEfficiency[`${teamName}`]}</StyledTableCell>
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
