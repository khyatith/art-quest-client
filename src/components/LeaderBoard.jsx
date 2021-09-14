import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
// import userContext from '../global/userContext';
import { socket } from '../global/socket';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function LeaderBoard() {
  const classes = useStyles();
  // const { player } = useContext(userContext);

  useEffect(() => {
    socket.on('updatedLeaderBoard', (updatedLeaderBoard) => {
      console.log(updatedLeaderBoard);
    });
  }, []);

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Team</TableCell>
              <TableCell align="right">no. of paintings</TableCell>
            </TableRow>
          </TableHead>
          {/* <TableBody></TableBody> */}
        </Table>
      </TableContainer>
    </>
  );
}

export default LeaderBoard;
