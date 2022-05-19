/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

import { API_URL } from '../../../global/constants';

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: 'brown',
    flexGrow: 1,
    position: 'relative',
  },
  'team-points': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8F8',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: '0px 0px 20px 20px',
  },
  'classify_points-container': {
    background: '#F8F5F4',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
    borderRadius: '20px',
    height: '846px',
  },
  img_overlay_info: {
    background: 'transparent',
  },
  left_grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginTop: '20px',
  },
  'painting-container': {
    width: '100%',
    height: '350px',
  },
  'painting-img_container': {
    width: '100%',
    // height: '100%',
  },
}));

const ExpoBegining2 = () => {
  const classes = useStyles();
  const [paintings, setPaintings] = useState([]);
  const [cityData, setCityData] = useState();
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [hasSentRequest, setHasSentRequest] = useState(false);
  const [otherTeams, setOtherTeams] = useState([]);
  // const [expanded, setExpanded] = React.useState(-1);
  // let ticketPrice = null;
  // const [timerValue, setTimerValue] = useState();
  // const [nominatedPaintings, setNominatedPaintings] = useState([]);
  // const [paintingSelected, setPaintingSelected] = useState(-1);
  // const [bidAmtError, setBidAmtError] = useState();
  // const [calculatedRevenue, setCalculatedRevenue] = useState();
  // const [ticketPriceFromAPI, setTicketPriceFromapi] = useState();
  // const [sellingAuctionBidWinner, setSellingAuctionBidWinner] = useState();
  // const history = useHistory();

  useEffect(() => {
    // setLoading(true);
    async function getSellingInfo() {
      const apiURL = `buying/getSellingInfo?roomId=${user.hostCode}&locationId=${user.currentLocation}&teamName=${user.teamName}&roundId=${user.roundId}`;
      const { data } = await axios.get(`${API_URL}/${apiURL}`);
      const {
        artifacts, otherteams, city, sellPaintingTimerValue,
      } = data;
      if (artifacts) {
        setPaintings(artifacts);
      }
      if (otherteams) {
        setOtherTeams(otherteams);
      }
      if (city) {
        setCityData(city);
      }
      setTimerValue(sellPaintingTimerValue);
    }
    if (!hasSentRequest) {
      setHasSentRequest(true);
      getSellingInfo();
    }
  }, [user, cityData, paintings]);
  console.log('paintings->', paintings);
  return (
    <>
      <AppBar className={classes.appbar}>
        <h2>Paris, France</h2>
      </AppBar>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        height: '100vh',
        width: '90%',
        margin: '0 auto',
        gap: '20px',
      }}
      >
        <div className={classes.left_grid}>
          <Card className={classes['painting-container']}>
            <div className={classes['painting-img_container']} style={{ backgroundColor: '#eee' }}>
              <p>Pop art</p>
            </div>
            <CardContent sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography component="div" variant="h5">
                    Name of Painting
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    Andy Warhol
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" component="div">
                    you paid $2 billion
                  </Typography>
                </CardContent>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography component="div" variant="subtitle1" color="text.secondary">
                    Nominate to auction
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    sell to market
                  </Typography>
                </CardContent>
              </Box>
            </CardContent>
          </Card>
          <Card className={classes['painting-container']}>
            <div className={classes['painting-img_container']} style={{ backgroundColor: '#eee' }}>
              <p>Pop art</p>
            </div>
            <CardContent sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography component="div" variant="h5">
                    Name of Painting
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    Andy Warhol
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" component="div">
                    you paid $2 billion
                  </Typography>
                </CardContent>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography component="div" variant="subtitle1" color="text.secondary">
                    Nominate to auction
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    sell to market
                  </Typography>
                </CardContent>
              </Box>
            </CardContent>
          </Card>
        </div>
        <div className="right_grid">
          <div className={classes['team-points']}>
            <p>Total Team Points</p>
            <p>Team 1</p>
            <p>Team 2</p>
            <p>Team 3</p>
            <p>Team 4</p>
          </div>
          <div className={classes['classify_points-container']}>

            <p style={{ padding: '20px' }}>ClassifyPoints donut Chart</p>
          </div>
        </div>

      </div>
    </>
  );
};

export default ExpoBegining2;
