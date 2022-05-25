/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import { API_URL } from '../../../global/constants';
import ChartComponent from './PaintingChart';
import PaintingCards from './PaintingCards';
import { socket } from '../../../global/socket';
import Painting from './Painting';

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
    paddingBottom: '5rem',
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
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    // width: '90%',
    height: '450px',
    background: '#FFFFFF',
    border: ' 1px solid #000000',
    borderRadius: '10px',
    margin: '5px',
    overflow: 'visible !important',
  },
  'painting-img_container': {
    width: '100%',
    height: '350px',
    position: 'relative',
  },
  'painting-art_movement': {
    bottom: '-15px',
    left: '5px',
    fontSize: '2rem',
    position: 'absolute',
    color: 'white',
    fontWeight: '800',
    textShadow: '0px 4px 20px #000000',
  },
  btn_container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5px',
  },
  auction_btn: {
    border: '1px solid black',
    padding: '1px 4px',
    borderRadius: '100px',
    margin: '4px auto !important',
    height: '22px',
    boxSizing: 'border-box',
    fontSize: '10px !important',
    width: '115px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: 'white',
  },
  enableTick: {
    opacity: '1 !important',
  },
  auction_btn_clickedGreen: {
    backgroundColor: '#006132',
    color: 'white',
  },
  auction_btn_clickedBlue: {
    backgroundColor: '#001AA4',
    color: 'white',
  },
  auction_drop: {
    background: '#FFFFFF',
    border: '1px solid #006132',
    borderRadius: '0px 0px 10px 10px',
    width: '100%',
    top: '453px',
  },
  error: {
    fontSize: '0.7rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red',
  },
}));

const artMovementsName = ['ukiyo-e', 'abstract', 'modernism', 'realism', 'pop-art', 'modern-art'];
const artMovementColors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(250, 154, 85)', 'rgb(69, 91, 255)', 'rgb(69, 255, 212)'];

const ExpoBegining2 = () => {
  const classes = useStyles();
  const [paintings, setPaintings] = useState([]);
  const [cityData, setCityData] = useState();
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [hasSentRequest, setHasSentRequest] = useState(false);
  const [paintingData, setPaintingData] = useState({});
  const [classifyPointsDetails, setClassifyPointsObj] = useState({});
  const [ChartData, setChartData] = useState({});
  // const [expanded, setExpanded] = React.useState(-1);
  const [otherTeams, setOtherTeams] = useState([]);
  const [disableAll, setDisableAll] = React.useState(false);
  const [timerValue, setTimerValue] = useState('');
  const [removeExpand, setRemoveExpand] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [startTimer, setStartTimer] = useState(false);

  // const [bidAmtError, setBidAmtError] = useState();
  // const [calculatedRevenue, setCalculatedRevenue] = useState();
  // const [ticketPriceFromAPI, setTicketPriceFromapi] = useState();
  // const [sellingAuctionBidWinner, setSellingAuctionBidWinner] = useState();
  // const history = useHistory();

  const calculateClassifyPointData = (data) => {
    const classifyPointsObj = {};
    const numberOfEachArtPaintings = [];

    data.artifacts?.map((pd) => {
      classifyPointsObj[pd.artMovement] = { numberOfPaintings: artMovementsName.filter((am) => am === pd.artMovement).length };
      return null;
    });

    Object.keys(classifyPointsObj).map((key) => {
      numberOfEachArtPaintings.push(classifyPointsObj[key].numberOfPaintings);
      return null;
    });

    setChartData({
      labels: Object.keys(classifyPointsObj),
      datasets: [{ data: numberOfEachArtPaintings, backgroundColor: artMovementColors, hoverOffset: 4 }],
    });
  };

  const createClassifyPointsData = (params) => {
    const paintingsObj = {};
    params?.map((pd) => {
      if (!paintingsObj[pd.artMovement]) {
        paintingsObj[pd.artMovement] = { ...paintingsObj[pd.artMovement], numberOfPainting: 0, images: [pd.imageURL] };
      } else {
        paintingsObj[pd.artMovement].numberOfPainting += 1;
        paintingsObj[pd.artMovement].images.push(pd.imageURL);
      }
      return null;
    });
    setClassifyPointsObj(paintingsObj);
  };

  const getRemainingTime = () => {
    const total = parseInt(timerValue.total, 10) - 1000;
    const seconds = Math.floor((parseInt(total, 10) / 1000) % 60);
    const minutes = Math.floor((parseInt(total, 10) / 1000 / 60) % 60);
    if (total < 1000) {
      socket.emit('expoBeginEnded');
    } else {
      const value = {
        total,
        minutes: minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
        seconds: seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
      };
      setTimerValue(value);
    }
  };
  useEffect(() => {
    // let interval;
    // if (timerValue && startTimer) {
    //   interval = setTimeout(() => setTimerValue((e) => e - 1), 1000);
    // }
    // return () => clearInterval(interval);
    let interval;
    if (timerValue && startTimer) {
      interval = setTimeout(() => getRemainingTime(), 1000);
    }
    return () => clearInterval(interval);
  }, [timerValue]);

  useEffect(() => {
    if (startTimer) {
      socket.emit('startExpoBeginTimer', {
        hostCode: user.hostCode,
      });
    }
  }, [startTimer]);

  useEffect(() => {
    const getTimer = async () => {
      await axios
        .get(`${API_URL}/buying/startExpoBeginTimer?roomId=${user.hostCode}`)
        .then((newData) => {
          console.log('timerValue->', newData);
          if (newData?.data?.sellPaintingTimerValue) {
            setTimerValue(newData.data.sellPaintingTimerValue);
            // setTimerValue(+newData.data.sellPaintingTimerValue.total / 1000);
          }
        }).catch((e) => console.log(e));
    };
    if (startTimer) {
      getTimer();
    }
  }, [startTimer]);
  console.log('timer->', timerValue);
  useEffect(() => {
    socket.on('ExpoBeginTimerStarted', () => {
      if (!startTimer) {
        setStartTimer(true);
      }
    });
  });// check for componentOnMount
  useEffect(() => {
    // setLoading(true);
    async function getSellingInfo() {
      const apiURL = `buying/getSellingInfo?roomId=${user.hostCode}&locationId=${user.currentLocation}&teamName=${user.teamName}&roundId=${user.roundId}`;
      const { data } = await axios.get(`${API_URL}/${apiURL}`);
      calculateClassifyPointData(data);
      createClassifyPointsData(data.artifacts);
      setPaintingData(data);
      const {
        artifacts, otherteams, city,
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
    }
    if (!hasSentRequest) {
      setHasSentRequest(true);
      getSellingInfo();
    }
  }, [user, cityData, paintings]);
  // console.log('paintings->', paintings);
  console.log('paintings->', paintings, user, disableAll);

  useEffect(() => {
    if (otherTeams.length > 1) {
      setDisableBtn(true);
    }
  }, [otherTeams]);
  const removeAllExpanded = () => {
    setRemoveExpand(true);
  };
  useEffect(() => {
    let timer;
    if (timerValue) {
      timer = setInterval(() => (setTimerValue((e) => (+e - 1))), 1000);
    }
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <AppBar className={classes.appbar}>
        <header className={classes.location}>{cityData?.cityName}</header>
        <div className={classes.auction_timer}>
          <div style={{ padding: '10px' }}>Auction starts</div>
          {' '}
          <span className={classes.timer}>
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5 0.25H5.5V1.91667H10.5V0.25Z" fill="#FFAFAF" />
              <path
                d="M13.8583 5.575L15.0417 4.39167C14.6833 3.96667 14.2917 3.56667 13.8667 3.21667L12.6833 4.4C11.3917 3.36667 9.76667 2.75 8 2.75C3.85833 2.75 0.5 6.10833 0.5 10.25C0.5 14.3917 3.85 17.75 8 17.75C12.15 17.75 15.5 14.3917 15.5 10.25C15.5 8.48333 14.8833 6.85833 13.8583 5.575ZM8.83333 11.0833H7.16667V6.08333H8.83333V11.0833Z"
                fill="#FFAFAF"
              />
            </svg>
            {/* {(+timerValue < 10 && +timerValue > 0) ? `0${timerValue}` : timerValue} */}
            {timerValue?.seconds}
            {' '}
            secs
          </span>
        </div>
      </AppBar>
      <div
        style={{
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
            <Painting item={item} key={item.auctionId} classes={classes} disableAll={disableAll} setDisableAll={setDisableAll} disableBtn={disableBtn} removeExpand={removeExpand} setRemoveExpand={setRemoveExpand} removeAllExpanded={removeAllExpanded} setStartTimer={setStartTimer} />
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
            <div style={{ display: 'flex', justifyContent: 'center' }}>{Object.keys(ChartData).length !== 0 && <ChartComponent ChartData={ChartData} />}</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <PaintingCards paintingData={paintingData.artifacts} paintingsObj={classifyPointsDetails} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpoBegining2;
