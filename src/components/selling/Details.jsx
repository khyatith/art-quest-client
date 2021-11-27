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
import { formatNumberToCurrency } from '../../global/helpers';
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
    <div style={{ marginLeft: '10%', marginRight: '10%', marginTop: '2%' }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell align="right">Team</StyledTableCell>
              <StyledTableCell align="right">Visits</StyledTableCell>
              <StyledTableCell align="right">Total Cash&nbsp;($)</StyledTableCell>
              <StyledTableCell align="right">Cash</StyledTableCell>
              <StyledTableCell align="right">Total</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const rowCash = parseFloat(row.cash);
              const cashRounded = parseFloat(rowCash / 1000).toFixed(2);
              const total = cashRounded + row.visits;
              return (
                <TableRow key={row.id} style={{ backgroundColor: `${TEAM_COLOR_MAP[row.team]}` }}>
                  <StyledTableCell component="th" scope="row">
                    {row.id}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.team}</StyledTableCell>
                  <StyledTableCell align="right">{row.visits}</StyledTableCell>
                  <StyledTableCell align="right">{formatNumberToCurrency(`${row.cash}`)}</StyledTableCell>
                  <StyledTableCell align="right">{cashRounded}</StyledTableCell>
                  <StyledTableCell align="right">{total}</StyledTableCell>
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
