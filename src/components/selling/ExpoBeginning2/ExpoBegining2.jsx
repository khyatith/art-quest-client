/* eslint-disable max-len */
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { API_URL } from '../../../global/constants';

const useStyles = makeStyles(() => ({
  appbar: {
    backgroundColor: 'brown',
    flexGrow: 1,
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: '8fr 2fr',
    height: '69px',
  },
  location: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '1.4rem',
    lineHeight: '108%',
    /* or 32px */
    letterSpacing: '-0.055em',
    color: '#F9F9F9',
  },
  auction_timer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '108%',
    /* or 17px */

    letterSpacing: '-0.055em',

    color: '#F9F9F9',
  },
  timer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#FFFFFF',
    borderRadius: '100px',
    color: '#E20000',
    padding: '10px',
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
    height: '700px',
  },

  left_grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginTop: '20px',
    height: '750px',
    overflowY: 'scroll',
    // overflowX: 'hidden',
    boxSizing: 'border-box',
  },
  'painting-container': {
    width: '90%',
    height: '375px',
    background: '#FFFFFF',
    border: ' 1px solid #000000',
    borderRadius: '10px',
    margin: '5px',
  },
  'painting-img_container': {
    width: '100%',
    height: '80%',
    position: 'relative',
  },
  'painting-art_movement': {
    bottom: '-15px',
    left: '5px',
    fontSize: '2rem',
    position: 'absolute',
    color: 'white',
    fontWeight: '800',
  },
  auction_btn: {
    border: '1px solid black',
    padding: '1px 4px',
    borderRadius: '10px',
    margin: '4px auto !important',
    height: '22px',
    boxSizing: 'border-box',
    fontSize: '10px !important',
    width: '115px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const ExpoBegining2 = () => {
  const classes = useStyles();
  const [paintings, setPaintings] = useState([]);
  const [cityData, setCityData] = useState();
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [hasSentRequest, setHasSentRequest] = useState(false);
  const [, setOtherTeams] = useState([]);
  // const [expanded, setExpanded] = React.useState(-1);
  // let ticketPrice = null;
  const [, setTimerValue] = useState();
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
      console.log('data->', data);
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
        <header className={classes.location}>Paris, France</header>
        <div className={classes.auction_timer}>
          <div style={{ padding: '10px' }}>Auction starts</div>
          {' '}
          <span className={classes.timer}>
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5 0.25H5.5V1.91667H10.5V0.25Z" fill="#FFAFAF" />
              <path d="M13.8583 5.575L15.0417 4.39167C14.6833 3.96667 14.2917 3.56667 13.8667 3.21667L12.6833 4.4C11.3917 3.36667 9.76667 2.75 8 2.75C3.85833 2.75 0.5 6.10833 0.5 10.25C0.5 14.3917 3.85 17.75 8 17.75C12.15 17.75 15.5 14.3917 15.5 10.25C15.5 8.48333 14.8833 6.85833 13.8583 5.575ZM8.83333 11.0833H7.16667V6.08333H8.83333V11.0833Z" fill="#FFAFAF" />
            </svg>
            30 secs
          </span>
        </div>
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
          {paintings.length > 0 && paintings.map((item) => (
            <Card className={classes['painting-container']}>
              <div className={classes['painting-img_container']} style={{ backgroundImage: `url(${item.imageURL})`, backgroundSize: 'cover' }}>
                <p className={classes['painting-art_movement']}>{item.artMovement}</p>
              </div>
              <CardContent sx={{
                display: 'flex', margin: '0', padding: '2px', justifyContent: 'space-between',
              }}
              >
                <Box sx={{
                  display: 'flex', flexDirection: 'column', fontSize: '.5rem', boxSizing: 'border-box',
                }}
                >
                  <CardContent sx={{
                    display: 'flex', flexDirection: 'column', flex: '1 0 auto', padding: '7px', justifyContent: 'center',
                  }}
                  >
                    <Typography
                      component="div"
                      variant="subtitle1"
                      style={{
                        fontWeight: 'bolder', letterSpacing: '0', lineHeight: '1', width: 'fit-content',
                      }}
                    >
                      {item?.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.primary" component="div" style={{ fontSize: '0.6rem' }}>
                      {item?.artist}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      component="div"
                      style={{
                        fontSize: '0.5rem', width: '100%', letterSpacing: '0', color: 'red',
                      }}
                    >
                      you paid $
                      {+item.bidAmount}
                      {' '}
                      million
                    </Typography>
                  </CardContent>
                </Box>
                <Box sx={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center',
                }}
                >
                  <CardContent sx={{
                    display: 'flex', flexDirection: 'column', flex: '1 0 auto', width: '120px', justifyContent: 'center', alignItems: 'center', padding: '7px',
                  }}
                  >
                    <Typography component="div" variant="subtitle1" className={classes.auction_btn}>
                      Nominate to auction
                    </Typography>
                    <Typography variant="subtitle1" component="div" className={classes.auction_btn}>
                      sell to market
                    </Typography>
                  </CardContent>
                </Box>
              </CardContent>
            </Card>
          ))}
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
