import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import load from '../../assets/load.webp';
import Header from '../Header';
import { API_URL, TEAM_COLOR_MAP } from '../../global/constants';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 20,
  },
}))(TableCell);

function createDataMap(id, team, visits, cash, total, classifyPoints, cashPoints) {
  return {
    id,
    team,
    visits,
    cash,
    total: parseFloat(total).toFixed(2),
    classifyPoints,
    cashPoints,
  };
}

function FinalResults() {
  const [rows, setRows] = useState();
  const [loading, setLoading] = useState(true);
  const [gameWinner, setGameWinner] = useState();
  const [showWinner, setShowWinner] = useState(false);
  const [hasValueFetched, setHasValueFetched] = useState(false);

  useEffect(() => {
    if (!hasValueFetched) {
      const user = JSON.parse(sessionStorage.getItem('user'));
      axios
        .get(`${API_URL}/buying/getSellingResults?roomId=${user.hostCode}`)
        .then((newData) => {
          const { amountSpentByTeam, visits } = newData.data;
          let x = 1;
          const tv = [];
          Object.entries(amountSpentByTeam).forEach(([key, value]) => {
            const team = key;
            const cash = value;
            let vis = 0;
            const teamVisits = visits.filter((v) => v.teamName === key);
            vis = teamVisits && teamVisits.length > 0 && teamVisits[0].totalVisitPrice ? parseInt(teamVisits[0].totalVisitPrice, 10) : 0.00;
            const formattedCash = parseFloat((cash) / 10).toFixed(2);
            const total = parseFloat(formattedCash) - parseFloat(vis) + 0;// need to add classify point here in place of 0
            tv.push(createDataMap(x, team, vis, cash, total, 0, formattedCash));// need to add classify point here in place of 0
            x += 1;
          });
          tv.sort((a, b) => b.total - a.total);
          for (let i = 0; i < tv.length; ++i) {
            tv[i].id = i + 1;
          }
          setGameWinner(tv[0].team);
          setRows(tv);
        })
        .finally(() => {
          setLoading(false);
          setHasValueFetched(true);
        });
    }
  }, [hasValueFetched]);

  const showTeamWinner = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const { teamName } = user;
    if (teamName === gameWinner) {
      return (
        <h2
          style={{
            backgroundColor: '#000000',
            padding: '20px',
            color: '#76e246',
            textAlign: 'center',
          }}
        >
          Congratulations! You are the winner!
        </h2>
      );
    }
    return (
      <h2
        style={{
          backgroundColor: '#000000',
          padding: '20px',
          color: '#76e246',
          textAlign: 'center',
        }}
      >
        The winner is Team&nbsp;
        {gameWinner}
      </h2>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setShowWinner(true);
    }, 5000);
  });

  if (loading) {
    return (
      <div style={{ marginTop: '12%', marginLeft: '43%' }}>
        {' '}
        <img src={load} alt="loading..." />
        {' '}
      </div>
    );
  }

  return (
    <>
      <Header />
      <div style={{ marginLeft: '10%', marginRight: '10%', marginTop: '2%' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Rank</StyledTableCell>
                <StyledTableCell align="right">Team</StyledTableCell>
                <StyledTableCell align="right">Cash</StyledTableCell>
                <StyledTableCell align="right">Cash points</StyledTableCell>
                <StyledTableCell align="right">Visits</StyledTableCell>
                <StyledTableCell align="right">Classify Points</StyledTableCell>
                <StyledTableCell align="right">Total</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows && rows.map((row) => (
                <TableRow key={row.id} style={{ backgroundColor: `${TEAM_COLOR_MAP[row.team]}` }}>
                  <StyledTableCell component="th" scope="row">
                    {row.id}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.team}</StyledTableCell>
                  <StyledTableCell align="right">{`$${row.cash}M`}</StyledTableCell>
                  <StyledTableCell align="right">{row.cashPoints}</StyledTableCell>
                  <StyledTableCell align="right">{row.visits}</StyledTableCell>
                  <StyledTableCell align="right">{row.classifyPoints}</StyledTableCell>
                  <StyledTableCell align="right">{row.total}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {!showWinner && <h2 style={{ textAlign: 'center' }}>And the winner is ....</h2>}
      {showWinner && showTeamWinner()}
    </>
  );
}

export default FinalResults;
