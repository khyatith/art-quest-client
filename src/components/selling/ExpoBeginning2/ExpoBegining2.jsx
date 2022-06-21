/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable operator-linebreak */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import { AccountCircleRounded } from '@material-ui/icons';
import { API_URL, TEAM_COLOR_MAP } from '../../../global/constants';
import ChartComponent from './PaintingChart';
import PaintingCards from './PaintingCards';
import { socket } from '../../../global/socket';
import Painting from './Painting';
import ConfirmationScreen from '../../ConfirmationScreen/ConfirmationScreen';
import LocationHeader from '../LocationHeader/LocationHeader';

const useStyles = makeStyles(() => ({
  'team-points': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8F8',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: '0px 0px 20px 20px',
    marginTop: '2rem',
    marginBottom: '2rem',
  },
  'classify_points-container': {
    background: '#F8F5F4',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
    borderRadius: '20px',
    // paddingBottom: '2rem',
    height: '800px',
    paddingBottom: '5rem',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  left_grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginTop: '20px',
    height: '930px',

    overflowY: 'scroll',
    // overflowX: 'hidden',
    boxSizing: 'border-box',
  },
  right_grid: {
    display: 'flex',
    gap: '10px',
    width: '100%',
    marginTop: '20px',
    height: '750px',
    // overflowY: 'scroll',
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
    '&:disabled': {
      border: 'gray 1px solid',
    },
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
  const [otherTeams, setOtherTeams] = useState([]);
  const [disableAll, setDisableAll] = React.useState(false);
  const [timerValue, setTimerValue] = useState('');
  const [removeExpand, setRemoveExpand] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [totalPoints, setTotalPoints] = useState({});
  const [showConfirmationScreen, setShowConfirmationScreen] = useState(false);
  const [sellToMarket, setSellToMarket] = useState(false);
  const [sellToMarketPainting, setSellToMarketPainting] = useState({});
  const history = useHistory();

  // const [bidAmtError, setBidAmtError] = useState();
  // const [calculatedRevenue, setCalculatedRevenue] = useState();
  // const [ticketPriceFromAPI, setTicketPriceFromapi] = useState();
  // const [sellingAuctionBidWinner, setSellingAuctionBidWinner] = useState();

  const calculateClassifyPointData = (data) => {
    const classifyPointsObj = {};
    const numberOfEachArtPaintings = [];

    const artMovementCollection = [];
    data?.artifacts.map((artifact) => {
      artMovementCollection.push(artifact.artMovement);
      return null;
    });

    data.artifacts?.map((pd) => {
      classifyPointsObj[pd.artMovement] = { numberOfPaintings: artMovementCollection.filter((am) => am === pd.artMovement).length };
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
      socket.emit('expoBeginEnded', { hostCode: user.hostCode });
    } else {
      const value = {
        total,
        minutes: minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
        seconds: seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }),
      };
      setTimerValue(value);
    }
  };

  const showTotalPoints = () => {
    const ponits = JSON.parse(sessionStorage.getItem('TOTAL_POINTS'));
    setTotalPoints(ponits);
  };

  useEffect(() => {
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
          if (newData?.data?.sellPaintingTimerValue) {
            setTimerValue(newData.data.sellPaintingTimerValue);
          }
        })
        .catch((e) => console.log(e));
    };
    if (startTimer) {
      getTimer();
    }
  }, [startTimer]);
  useEffect(() => {
    socket.on('ExpoBeginTimerStarted', () => {
      if (!startTimer) {
        setStartTimer(true);
      }
    });
  }); // check for componentOnMount
  useEffect(() => {
    // setLoading(true);
    async function getSellingInfo() {
      const apiURL = `buying/getSellingInfo?roomId=${user.hostCode}&locationId=${user.currentLocation}&teamName=${user.teamName}&roundId=${user.roundId}`;
      const { data } = await axios.get(`${API_URL}/${apiURL}`);
      calculateClassifyPointData(data);
      createClassifyPointsData(data.artifacts);
      setPaintingData(data);
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
    if (!hasSentRequest) {
      setHasSentRequest(true);
      getSellingInfo();
    }
  }, [user, cityData, paintings]);

  useEffect(() => {
    if (otherTeams.length > 1) {
      setDisableBtn(true);
    }
  }, [otherTeams]);
  const removeAllExpanded = () => {
    setRemoveExpand(true);
  };
  useEffect(() => {
    showTotalPoints();
    let timer;
    if (timerValue) {
      timer = setInterval(() => setTimerValue((e) => +e - 1), 1000);
    }
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    socket.on('auctionConfirmation', (params) => {
      if (params.teamName) {
        if (user.teamName === params.teamName) {
          setShowConfirmationScreen(true);
        }
      }
    });
  }, []);
  useEffect(() => {
    socket.on('sellToMarketConfirmation', (params) => {
      if (params.teamName) {
        if (user.teamName === params.teamName) {
          setSellToMarket(true);
          setSellToMarketPainting(params);
          setShowConfirmationScreen(true);
        }
      }
    });
  }, []);
  useEffect(() => {
    socket.on('ExpoBeginTimerEnded', () => {
      console.log('routing to next page');
      history.push({
        pathname: `/sell/auction/${user.playerId}`,
        state: { cityData, sellToMarketPainting, showOtherTeamsUpdates: !disableBtn },
      });
    });
  }, [sellToMarketPainting, cityData, disableBtn]);
  return (
    <>
      <LocationHeader timerValue={timerValue} cityData={cityData} user={user} />
      {!showConfirmationScreen && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              height: '100vh',
              width: '90%',
              margin: '0 auto',
              gap: '20px',
              paddingTop: '66px',
              // marginTop: '66px',
            }}>
            <div className={classes.left_grid}>
              {paintings.length > 0 &&
                paintings.map((item, idx) => (
                  <Painting
                    item={item}
                    // eslint-disable-next-line react/no-array-index-key
                    key={idx}
                    classes={classes}
                    disableAll={disableAll}
                    setDisableAll={setDisableAll}
                    disableBtn={disableBtn}
                    removeExpand={removeExpand}
                    setRemoveExpand={setRemoveExpand}
                    removeAllExpanded={removeAllExpanded}
                    setStartTimer={setStartTimer}
                    cityData={cityData}
                    otherTeams={otherTeams}
                  />
                ))}
            </div>
            <div className="right_grid">
              <div className={classes['team-points']}>
                <h3>Total Team Points</h3>
                {Object.keys(totalPoints).map((teamName) => (
                  <span style={{ marginLeft: '1rem' }}>
                    {teamName !== '' && (
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <AccountCircleRounded style={{ color: teamName ? TEAM_COLOR_MAP[teamName] : '' }} />
                        <span style={{ marginLeft: '0.5em' }}>{totalPoints[teamName]}</span>
                      </div>
                    )}
                  </span>
                ))}
              </div>
              <div className={classes['classify_points-container']}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {Object.keys(ChartData).length !== 0 && <ChartComponent ChartData={ChartData} />}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                  <PaintingCards paintingData={paintingData.artifacts} paintingsObj={classifyPointsDetails} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {showConfirmationScreen && <ConfirmationScreen cityData={cityData} sellToMarket={sellToMarket} sellToMarketPainting={sellToMarketPainting} classes={classes} user={user} />}
    </>
  );
};

export default ExpoBegining2;
