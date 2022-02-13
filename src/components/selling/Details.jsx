import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { TEAM_COLOR_MAP } from '../../global/constants';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 20,
  },
}))(TableCell);

const Details = (props) => {
  const { rows } = props;
  return (
    <div style={{ marginTop: '2%', marginLeft: '10px' }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Rank</StyledTableCell>
              <StyledTableCell align="right">Team</StyledTableCell>
              <StyledTableCell align="right">Cash</StyledTableCell>
              <StyledTableCell align="right">Cash Points</StyledTableCell>
              <StyledTableCell align="right">Visits</StyledTableCell>
              <StyledTableCell align="right">Art Score</StyledTableCell>
              <StyledTableCell align="right">Total</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const formattedCash = parseFloat((row.cash) / 10).toFixed(2);
              const total = parseFloat(formattedCash) + parseFloat(row.visits) + parseFloat(row.artScore);
              return (
                <TableRow key={row.id} style={{ backgroundColor: `${TEAM_COLOR_MAP[row.team]}` }}>
                  <StyledTableCell component="th" scope="row">
                    {row.id}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.team}</StyledTableCell>
                  <StyledTableCell align="right">{`$${parseFloat(row.cash).toFixed(2)}M`}</StyledTableCell>
                  <StyledTableCell align="right">{formattedCash}</StyledTableCell>
                  <StyledTableCell align="right">{row.visits}</StyledTableCell>
                  <StyledTableCell align="right">{parseFloat(row.artScore).toFixed(2)}</StyledTableCell>
                  <StyledTableCell align="right">{parseFloat(total).toFixed(2)}</StyledTableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

Details.defaultProps = {
  rows: [],
};

Details.propTypes = {
  rows: PropTypes.object,
};

export default Details;
