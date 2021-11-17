import React, { useEffect, useState, useContext } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Button, CardActionArea, CardActions } from '@mui/material';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { API_URL } from '../../global/constants';
import userContext from '../../global/userContext';
import SimpleRating from '../Rating';

const useStyles = makeStyles(() => ({
  paintOpt: {
    backgroundColor: '#76e246',
  },
  contentstyle: {
    textAlign: 'center',
  },
  teammark: {
    height: '35px',
    width: '35px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  fontSty: {
    fontSize: 'large',
    fontWeight: '700',
    lineHeight: '24px',
    padding: '10px',
  },
  fontSty2: {
    fontSize: '27px',
    fontWeight: 'bold',
    paddingTop: '30px',
    paddingLeft: '50px',
  },
  parent: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  child1: {
    flex: '0 2 30%' /* explanation below */,
    paddingLeft: '2%',
    paddingBottom: '0.5%',
  },
  child2: {
    flex: '0 2 18%' /* explanation below */,
    marginLeft: '30%',
    textAlign: 'center',
    paddingBottom: '0.5%',
    height: 'auto',
  },
  paper: {
    maxWidth: 600,
    marginLeft: '20%',
  },
  table: {
    maxWidth: 600,
  },
  cityData: {
    flex: '20 2 30%',
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 700,
    fontSize: 16,
  },
  body: {
    fontSize: 20,
    fontWeight: 700,
  },
}))(TableCell);

function ExpoBeginning() {
  const classes = useStyles();
  const [paintings, setPaintings] = useState([]);
  const [cityData, setCityData] = useState();
  const { player } = useContext(userContext);
  const [otherTeams, setOtherTeams] = useState([]);

  // Hooks and methods
  useEffect(() => {
    // setLoading(true);
    async function getSellingInfo() {
      const { data } = await axios.get(`${API_URL}/buying/getSellingInfo?roomId=${player.hostCode}&locationId=1&teamName=${player.teamName}`);
      console.log('data', data);
      const { artifacts, otherteams, city } = data;
      if (artifacts) {
        setPaintings(artifacts);
      }
      if (otherteams) {
        console.log('otherteam', otherteams);
        setOtherTeams(otherteams);
      }
      if (city) {
        setCityData(city);
      }
    }
    getSellingInfo();

    // .then((newData) => {
    //   console.log('newData', newData);
    //   setPaintings(newData.data.artifacts);
    //   console.log(newData);
    //   const ot = newData.data.otherteams;
    //   ot.push(player.teamName);
    //   setTeams(ot);
    //   console.log(ot);
    // })
    // .finally(() => {
    //   setLoading(false);
    // });
  }, []);

  // if (loading) {
  //   return (
  //     <div style={{ marginTop: '12%', marginLeft: '43%' }}>
  //       {' '}
  //       <img src={load} alt="loading..." />
  //       {' '}
  //     </div>
  //   );
  // }

  const renderCityStats = () => {
    const { interestInArt, demand } = cityData;
    // eslint-disable-next-line no-nested-ternary
    const peopleInterestedInArt = parseInt(interestInArt, 10) < 100
      ? 'Low' : (parseInt(interestInArt, 10) > 100 && parseInt(interestInArt, 10) < 200
        ? 'Medium'
        : 'High'
      );
    return (
      <>
        <h2 style={{ textAlign: 'center' }}>
          About
          {' '}
          {player.currentLocationName}
        </h2>
        <TableContainer className={classes.paper} component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="right">
                  Population
                </StyledTableCell>
                <StyledTableCell align="right">Level of interest in art</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <StyledTableCell align="right">
                  {demand}
                  M
                </StyledTableCell>
                <StyledTableCell align="right">{peopleInterestedInArt}</StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  return (
    <>
      <div className={classes.parent}>
        <div>
          <div className={classes.parent}>
            {cityData
            && (
            <div className={classes.cityData}>
              {renderCityStats()}
            </div>
            )}
            <div className={classes.child2} style={{ backgroundColor: player.teamColor }}>
              <p className={classes.fontSty}>
                You are in
                {' '}
                {' '}
                {player.currentLocationName}
              </p>
              { otherTeams.length !== 0
                ? (
                  <>
                    <p className={classes.fontSty}>
                      Other teams in
                      {' '}
                      {' '}
                      {player.currentLocationName}
                    </p>
                    {otherTeams.map((arg) => (
                      <div className={classes.teammark} style={{ backgroundColor: arg, borderRadius: '100%' }} />
                    ))}
                  </>
                )
                : (
                  <p className={classes.fontSty}>
                    There are no other teams with
                    {' '}
                    you in
                    {' '}
                    {player.currentLocationName}
                  </p>
                )}
            </div>
          </div>
          <Box justifyContent="center" display="flex" flexWrap="wrap" p={1} m={1}>
            {paintings && paintings.map((arg) => (
              <Box
                p={1}
                sx={{
                  paddingLeft: '20px',
                  paddingRight: '20px',
                }}
              >
                <Card
                  sx={{
                    minHeight: 445,
                    maxHeight: 445,
                    minWidth: 355,
                    maxWidth: 355,
                    backgroundColor: 'white',
                    margin: 'auto',
                    marginTop: '3%',
                  }}
                >
                  <CardActionArea>
                    <CardMedia sx={{ height: 398 }} component="img" image={arg.auctionObj.imageURL} alt="green iguana" />
                  </CardActionArea>
                  <CardActions className={classes.paintOpt}>
                    <Button size="small" style={{ color: '#000000', fontWeight: 'bold', width: '100%' }}>
                      SELECT
                    </Button>
                  </CardActions>
                </Card>
                <div className={classes.contentstyle}>
                  <p>Painting Quality</p>
                  <SimpleRating rating={parseFloat(arg.paintingQuality)} />
                </div>
              </Box>
            ))}
          </Box>
        </div>
      </div>
    </>
  );
}

export default ExpoBeginning;
