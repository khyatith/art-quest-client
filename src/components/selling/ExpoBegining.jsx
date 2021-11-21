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
import CardContent from '@material-ui/core/CardContent';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import clsx from 'clsx';
import { TextField } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import { API_URL } from '../../global/constants';
import userContext from '../../global/userContext';
import SimpleRating from '../Rating';

const useStyles = makeStyles((theme) => ({
  paintOpt: {
    backgroundColor: '#ffffff',
    textAlign: 'center',
  },
  nominateBtn: {
    backgroundColor: '#76e246',
  },
  contentstyle: {
    textAlign: 'center',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    backgroundColor: '#000000',
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
  parent: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  child1: {
    flex: '0 2 70%' /* explanation below */,
    marginTop: '0.5%',
    paddingBottom: '0.5%',
  },
  child2: {
    flex: '0 2 29.84%' /* explanation below */,
    borderLeft: '1%',
    borderTop: '0',
    borderBottom: '0',
    borderRight: '0',
    borderStyle: 'solid',
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
  const [expanded, setExpanded] = React.useState(-1);
  const [paintingSelected, setPaintingSelected] = React.useState(-1);
  const [selectionDone, setSelectionDone] = React.useState(false);

  const handleExpandClick = (index) => {
    setExpanded(index);
  };

  const handleSelectPainting = (index) => {
    setPaintingSelected(index);
    setSelectionDone(true);
  };

  // Hooks and methods
  useEffect(() => {
    // setLoading(true);
    async function getSellingInfo() {
      const { data } = await axios.get(`${API_URL}/buying/getSellingInfo?roomId=${player.hostCode}&locationId=1&teamName=${player.teamName}`);
      const { artifacts, otherteams, city } = data;
      if (artifacts) {
        setPaintings(artifacts);
      }
      if (otherteams) {
        setOtherTeams(otherteams);
      }
      if (city) {
        setCityData(city);
      }
    }
    getSellingInfo();
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
      ? 'Low'
      : parseInt(interestInArt, 10) > 100
    && parseInt(interestInArt, 10) < 200
        ? 'Medium'
        : 'High';
    return (
      <>
        <h2 style={{ textAlign: 'center' }}>
          About
          {player.currentLocationName}
        </h2>
        <TableContainer className={classes.paper} component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="right">Population</StyledTableCell>
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

  const loadCardContent = (index) => (
    <CardContent className={classes.paintOpt}>
      <p style={{ color: '#000000', fontWeight: '700', marginBottom: '25px' }}>
        How much would you charge 1 person to see your painting in
        {' '}
        {player.currentLocationName}
        {' '}
        museum?
      </p>
      <TextField
        id="outlined-basic"
        label="Enter Ticket Price"
        variant="outlined"
        style={{ color: '#76e246', marginBottom: '20px' }}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />
      <Button
        size="small"
        style={{
          color: '#76e246',
          fontWeight: 'bold',
          width: '100%',
          backgroundColor: '#000000',
        }}
        onClick={() => handleSelectPainting(index)}
      >
        Submit ticket price for 1 person
      </Button>
    </CardContent>
  );

  const loadCardSelection = () => (
    <CardContent className={classes.paintOpt}>
      <Typography>You selected this painting for auction</Typography>
    </CardContent>
  );

  return (
    <>
      <div className={classes.parent}>
        <div className={classes.child1}>{cityData && <div className={classes.cityData}>{renderCityStats()}</div>}</div>
        <div className={classes.child2} style={{ backgroundColor: player.teamColor }}>
          <p className={classes.fontSty}>
            You are in
            {' '}
            {player.currentLocationName}
          </p>
          {otherTeams.length !== 0 ? (
            <>
              <p className={classes.fontSty}>
                Other teams in
                {player.currentLocationName}
              </p>
              {otherTeams.map((arg) => (
                <div className={classes.teammark} style={{ backgroundColor: arg, borderRadius: '100%' }} />
              ))}
            </>
          ) : (
            <p className={classes.fontSty}>
              There are no other teams with you in
              {' '}
              {player.currentLocationName}
            </p>
          )}
        </div>
      </div>
      <div className={classes.parent}>
        <Box className={classes.child1} justifyContent="center" display="flex" flexWrap="wrap">
          {paintings
            && paintings.map((arg, index) => (
              <Box
                p={1}
                sx={{
                  paddingLeft: '20px',
                  paddingRight: '20px',
                }}
                // eslint-disable-next-line no-nested-ternary
                display={paintingSelected === -1 ? 'block' : paintingSelected === index ? 'block' : 'none'}
              >
                <Card
                  sx={{
                    minHeight: 445,
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
                  <CardActions className={classes.nominateBtn}>
                    <Button
                      size="small"
                      style={{ color: '#000000', fontWeight: 'bold', width: '100%' }}
                      className={clsx(classes.expand, {
                        [classes.expandOpen]: index === expanded,
                      })}
                      onClick={() => handleExpandClick(index)}
                      aria-expanded={index === expanded}
                      aria-label="show more"
                    >
                      Nominate
                    </Button>
                  </CardActions>
                  <Collapse in={index === expanded} timeout="auto" unmountOnExit>
                    {!selectionDone && loadCardContent(index)}
                    {selectionDone && loadCardSelection()}
                  </Collapse>
                </Card>
                <div className={classes.contentstyle}>
                  <p>Painting Quality</p>
                  <SimpleRating rating={parseFloat(arg.paintingQuality)} />
                </div>
              </Box>
            ))}
        </Box>
        <div className={classes.child2}>
          <div>Place where we will include Bonus Auction</div>
        </div>
      </div>
    </>
  );
}

export default ExpoBeginning;
