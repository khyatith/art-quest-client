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
import { useHistory } from 'react-router';
import Header from './Header';
import { API_URL, TEAM_COLOR_MAP } from '../global/constants';
import { formatNumberToCurrency } from '../global/helpers';
import useSessionStorage from '../hooks/useSessionStorage';

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
  const [gameWinner, setGameWinner] = useState();
  // const [teamEfficiency, setTeamEfficiency] = useState({});
  const [totalDebtByTeam, setTotalDebtByTeam] = useState({});
  const [teamsByRank, setTeamsByRank] = useState([]);
  // const [showWinner, setShowWinner] = useState(false);
  const [totalPaintingsWonByTeam, setTotalPaintingsWonByTeam] = useState({});
  const [totalArtScore, setTotalArtScore] = useState({});
  // const { setPlayer } = useContext(userContext);
  // const { setLeaderboardData } = useContext(leaderboardContext);
  // const [sortedTeamsByPaintingsWon, setSortedTeamsByPaintingsWon] = useState({});
  // const [avgPaintingQualityByTeam, setAvgPaintingQualityByTeam] = useState({});
  // const [showWinner, setShowWinner] = useState(false);
  // const { setPlayer } = useContext(userContext);
  // const { setLeaderboardData } = useContext(leaderboardContext);
  const player = useSessionStorage('user')[0];

  const getWinner = async () => {
    const { data } = await axios.get(`${API_URL}/buying/getWinner/${player.hostCode}`);
    console.log('data', data);
    if (data && data.leaderBoard) {
      const { teamName } = player;
      const allTeamArt = data.leaderBoard[teamName];
      setArtForTeams(allTeamArt);
    }
    if (data && data.winner) {
      setGameWinner(data.winner);
    }
    if (data && data.teamsByRank) {
      setTeamsByRank(data.teamsByRank);
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
    if (data && data.totalArtScoreForTeams) {
      console.log('data', data);
      setTotalArtScore(data.totalArtScoreForTeams);
    }
  };

  useEffect(() => {
    if (!gameWinner) {
      getWinner();
    }
  }, [gameWinner]);

  const renderLeaderboardData = () => {
    const tableData = teamsByRank.map((key) => ({
      key,
      debt: totalDebtByTeam[key],
      totalPaintings: totalPaintingsWonByTeam[key],
      totalArtScoreForTeam: totalArtScore[key],
      // efficiency: teamEfficiency[key],
    }));
    return (
      <>
        <h2 style={{ textAlign: 'center' }}>All teams</h2>
        <TableContainer className={classes.paper} component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Team</StyledTableCell>
                <StyledTableCell align="right">Total paintings</StyledTableCell>
                <StyledTableCell align="right">Art score</StyledTableCell>
                <StyledTableCell align="right">Debt</StyledTableCell>
                {/* <StyledTableCell align="right">Efficiency</StyledTableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.key} style={{ backgroundColor: `${TEAM_COLOR_MAP[row.key]}` }}>
                  <StyledTableCell component="th" scope="row">
                    {row.key}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.totalPaintings}</StyledTableCell>
                  <StyledTableCell align="right">{row.totalArtScoreForTeam}</StyledTableCell>
                  <StyledTableCell align="right">{formatNumberToCurrency(parseFloat(row.debt))}</StyledTableCell>
                  {/* <StyledTableCell align="right">{formatNumberToCurrency(parseFloat(row.efficiency))}</StyledTableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  // const resetApplication = () => {
  //   history.push('/');
  //   setPlayer({
  //     playerName: '',
  //     teamName: '',
  //     playerId: '',
  //     hostCode: '',
  //     teamColor: '',
  //     currentLocation: '',
  //   });
  //   setLeaderboardData({ leaderboardData: {} });
  //   sessionStorage.clear();
  // };

  // const showTeamWinner = () => {
  //   const { teamName } = player;
  //   if (teamName === gameWinner) {
  //     return <h2 style={{ backgroundColor: '#000000', padding: '20px', color: '#76e246' }}>Congratulations! You are the winner!</h2>;
  //   }
  //   return (
  //     <h2 style={{ backgroundColor: '#000000', padding: '20px', color: '#76e246' }}>
  //       The winner is Team&nbsp;
  //       {gameWinner}
  //     </h2>
  //   );
  // };

  // useEffect(() => {
  //   setTimeout(() => {
  //     setShowWinner(true);
  //   }, 5000);
  // });

  useEffect(() => {
    setTimeout(() => {
      history.push(`/sell/instructions/${player.playerId}`);
    }, 15000);
  });

  return (
    <>
      <Header />
      {teamsByRank && totalPaintingsWonByTeam && totalArtScore && renderLeaderboardData()}
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
            {artforTeams
              && artforTeams.map((item) => {
                const { auctionObj } = item;
                return (
                  <ImageListItem key={item.auctionId}>
                    <img key={item.auctionId} src={auctionObj.imageURL} alt={auctionObj.name} />
                  </ImageListItem>
                );
              })}
          </ImageList>
        </div>
      </div>
    </>
  );
}

export default EndBuyingPhase;
