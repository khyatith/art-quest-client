import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import userContext from '../../global/userContext';
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

function createDataMap(id, team, visits, cash) {
  return {
    id,
    team,
    visits,
    cash,
  };
}

function FinalResults() {
  const player = useContext(userContext);
  const [rows, setRows] = useState();
  const [loading, setLoading] = useState(true);
  const [gameWinner, setGameWinner] = useState();
  const [showWinner, setShowWinner] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/buying/getSellingResults?roomId=${player.hostCode}`)
      .then((newData) => {
        const { amountSpentByTeam, visits } = newData.data;
        let x = 1;
        console.log(amountSpentByTeam);
        const tv = [];
        Object.entries(amountSpentByTeam).forEach(([key, value]) => {
          const team = key;
          const cash = value;
          let vis = 0;
          const teamVisits = visits.filter((v) => v.teamName === key);
          vis = teamVisits.length > 0 ? teamVisits[0].visitCount : 0.0;
          tv.push(createDataMap(x, team, vis, cash));
          x += 1;
        });
        tv.sort((a, b) => b.cash - a.cash);
        for (let i = 0; i < tv.length; ++i) {
          tv[i].id = i + 1;
          console.log(tv.id);
        }
        console.log(tv);
        setGameWinner(tv[0].team);
        setRows(tv);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const showTeamWinner = () => {
    const { teamName } = player;
    if (teamName === gameWinner) {
      return (
        <h2 style={{
          backgroundColor: '#000000', padding: '20px', color: '#76e246', textAlign: 'center',
        }}
        >
          Congratulations! You are the winner!
        </h2>
      );
    }
    return (
      <h2 style={{
        backgroundColor: '#000000', padding: '20px', color: '#76e246', textAlign: 'center',
      }}
      >
        The winner is Team
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
                <StyledTableCell align="right">Visits</StyledTableCell>
                <StyledTableCell align="right">Total Cash&nbsp;($)</StyledTableCell>
                <StyledTableCell align="right">Cash</StyledTableCell>
                <StyledTableCell align="right">Total</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const total = row.cash + row.visits;
                return (
                  <TableRow key={row.id} style={{ backgroundColor: `${TEAM_COLOR_MAP[row.team]}` }}>
                    <StyledTableCell component="th" scope="row">
                      {row.id}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.team}</StyledTableCell>
                    <StyledTableCell align="right">{row.visits}</StyledTableCell>
                    <StyledTableCell align="right">{`$${row.cash}M`}</StyledTableCell>
                    <StyledTableCell align="right">{row.cash}</StyledTableCell>
                    <StyledTableCell align="right">{total}</StyledTableCell>
                  </TableRow>
                );
              })}
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
