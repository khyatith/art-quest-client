import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
// import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router';
import { API_URL, TEAM_COLOR_MAP } from '../global/constants';
import { formatNumberToCurrency } from '../global/helpers';
import useSessionStorage from '../hooks/useSessionStorage';
import Header from './Header';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '40px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  table: {
    maxWidth: 700,
  },
  paper: {
    maxWidth: 700,
    margin: '0 auto',
  },
  btnform: {
    backgroundColor: '#76e246',
    margin: '20px auto',
    // margin: '60px 0 60px 0px',
    width: 400,
    color: '#051207',
    fontWeight: '700',
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 20,
    fontWeight: 700,
  },
}))(TableCell);

function EndBuyingPhase() {
  const classes = useStyles();
  const history = useHistory();
  const [artforTeams, setArtForTeams] = useState();
  // const [teamEfficiency, setTeamEfficiency] = useState({});
  const [totalDebtByTeam, setTotalDebtByTeam] = useState({});
  const [totalPaintingsWonByTeam, setTotalPaintingsWonByTeam] = useState({});
  const [allTeams, setAllTeams] = useState([]);
  const [classifyPoints, setClassifyPoints] = useState([]);
  const player = useSessionStorage('user')[0];

  const getWinner = async () => {
    const { data } = await axios.get(`${API_URL}/buying/getWinner/${player.hostCode}`);
    if (data && data.leaderBoard) {
      const { teamName } = player;
      const allTeamArt = data.leaderBoard[teamName];
      setArtForTeams(allTeamArt);
    }
    if (data && data.allTeams) {
      setAllTeams(data.allTeams);
    }
    if (data && data.classifyPoints) {
      setClassifyPoints(data.classifyPoints);
    }
    if (data && data.totalPaintingsWonByTeam) {
      setTotalPaintingsWonByTeam(data.totalPaintingsWonByTeam);
    }
    // if (data && data.teamEfficiency) {
    //   setTeamEfficiency(data.teamEfficiency);
    // }
    if (data && data.totalAmountSpentByTeam) {
      setTotalDebtByTeam(data.totalAmountSpentByTeam);
    }
  };

  useEffect(() => {
    if (allTeams.length === 0) {
      getWinner();
    }
  }, [allTeams]);

  const renderLeaderboardData = () => {
    const tableData = allTeams.map((key) => ({
      key,
      debt: totalDebtByTeam[key] ? totalDebtByTeam[key] : 0,
      totalPaintings: totalPaintingsWonByTeam[key] ? totalPaintingsWonByTeam[key] : 0,
      classifyPoint: classifyPoints[key] ? classifyPoints[key] : 0,
    }));
    return (
      <>
        <h2 style={{ textAlign: 'center' }}>Results</h2>
        <TableContainer className={classes.paper} component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Team</StyledTableCell>
                <StyledTableCell align="right">Total paintings</StyledTableCell>
                <StyledTableCell align="right">Debt</StyledTableCell>
                <StyledTableCell align="right">Cash Points</StyledTableCell>
                <StyledTableCell align="right">Classify</StyledTableCell>
                <StyledTableCell align="right">Total</StyledTableCell>
                {/* <StyledTableCell align="right">Efficiency</StyledTableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => {
                const formattedDebt = parseFloat(row.debt / 10).toFixed(2);
                const totalPoints = (parseFloat(formattedDebt) + parseFloat(row.classifyPoint)).toFixed(2);
                return (
                  <TableRow key={row.key} style={{ backgroundColor: `${TEAM_COLOR_MAP[row.key]}` }}>
                    <StyledTableCell component="th" scope="row">
                      {row.key}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.totalPaintings}</StyledTableCell>
                    <StyledTableCell align="right">{formatNumberToCurrency(parseFloat(row.debt))}</StyledTableCell>
                    <StyledTableCell align="right">{formattedDebt}</StyledTableCell>
                    <StyledTableCell align="right">{row.classifyPoint}</StyledTableCell>
                    <StyledTableCell align="right">{totalPoints}</StyledTableCell>
                    {/* <StyledTableCell align="right">{formatNumberToCurrency(parseFloat(row.efficiency))}</StyledTableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  useEffect(() => {
    if (player?.version !== 1) {
      setTimeout(() => {
        history.push(`/sell/instructions/${player.playerId}`);
      }, 15000);
    } else {
      console.log('not moving to buying phase');
    }
  });

  // function Alert(props) {
  //   return <MuiAlert elevation={6} variant="filled" {...props} />;
  // }

  return (
    <>
      <Header player={player} tempBudget={totalDebtByTeam[player.teamName]} />
      {/* Not moving to phase 2 */}
      {/* <Alert severity="warning">Starting Phase 2 in 15 seconds ...</Alert> */}
      {/* {allTeams && totalPaintingsWonByTeam && totalArtScore && renderLeaderboardData()} */}
      {allTeams && totalPaintingsWonByTeam && renderLeaderboardData()}
      {/* <div style={{ margin: '40px auto', textAlign: 'center' }}>
        <Button className={classes.btnform} variant="contained" onClick={resetApplication}>
          Start New Game
        </Button>
      </div> */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        {/* {!showWinner && <h2>And the winner is ....</h2>}
        {showWinner && showTeamWinner()} */}
        <h3>Your art collection</h3>
        <div className={classes.root}>
          <ImageList rowHeight={300} className={classes.imageList}>
            {artforTeams && artforTeams.map((item) => (
              <ImageListItem key={item.auctionId}>
                <img key={item.auctionId} src={item.imageURL} alt={item.name} />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      </div>
    </>
  );
}

export default EndBuyingPhase;
