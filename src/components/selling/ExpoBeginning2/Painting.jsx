/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable max-len */
import React from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { validateCurrentBid } from '../../../global/helpers';
import { API_URL } from '../../../global/constants';
import { socket } from '../../../global/socket';

function Painting({ item, classes, disableAll, setDisableAll, removeAllExpanded, removeExpand, setRemoveExpand, disableBtn, setStartTimer }) {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [auctionPrice, setAuctionPrice] = React.useState('');
  const [error, setError] = React.useState('');
  const [expandAuction, setExpandAuction] = React.useState(false);
  const [expandedMarket, setExpandMarket] = React.useState(false);
  const [bidDone, setBidDone] = React.useState(false);
  const handleClick = (type) => {
    if (type === 'auction') {
      setExpandMarket(false);
      setExpandAuction((e) => !e);
    }
    if (type === 'market') {
      setExpandAuction(false);
      setExpandMarket((e) => !e);
    }
  };
  React.useEffect(() => {
    const removeExpanded = () => {
      if (!bidDone) {
        setExpandAuction(false);
        setExpandMarket(false);
      }
    };
    if (removeExpand) {
      removeExpanded();
      setRemoveExpand(false);
    }
  }, [removeExpand]);
  const setAuctionPriceHandler = async () => {
    try {
      const isValidCurrentBid = validateCurrentBid(auctionPrice);

      console.log(isValidCurrentBid, auctionPrice);
      if (!isValidCurrentBid) {
        setError('Please enter a valid Auction Amount');
        setTimeout(() => setError(''), 2000);
        return;
      }
      const auction = {
        paintingId: item.auctionId,
        imageURL: item.imageURL,
        artMovement: item?.artMovement,
        artMovementId: item?.artMovementId,
        artist: item?.artist,
        name: item?.name,
        bidAmount: auctionPrice,
        bidAt: +new Date(),
      };
      const payload = {
        roomId: user.hostCode,
        roundId: user.roundId,
        locationId: user.currentLocation,
        teamColor: user.teamName,
        auction,
      };
      await axios.post(`${API_URL}/buying/nominateForAuction`, { ...payload });
      socket.emit('auctionConfirmation', { ...payload });

      setDisableAll(true);
      setBidDone(true);
      removeAllExpanded();
      setStartTimer(true);
    } catch (e) {
      setError(e);
      setTimeout(() => setError(''), 2000);
    }
  };
  return (
    <Card className={classes['painting-container']}>
      <div className={classes['painting-img_container']} style={{ backgroundImage: `url(${item.imageURL})`, backgroundSize: 'cover' }}>
        <p className={classes['painting-art_movement']}>{item.artMovement}</p>
      </div>
      <CardContent
        sx={{
          display: 'flex',
          margin: '0',
          padding: '2px',
          justifyContent: 'space-between',
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '.5rem',
            boxSizing: 'border-box',
          }}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: '1 0 auto',
              padding: '7px',
              justifyContent: 'center',
            }}>
            <Typography
              component="div"
              variant="subtitle1"
              style={{
                fontWeight: 'bolder',
                letterSpacing: '0',
                lineHeight: '1',
                width: 'fit-content',
              }}>
              {item?.name}
            </Typography>
            <Typography variant="subtitle1" color="text.primary" component="div" style={{ fontSize: '0.6rem' }}>
              {item?.artist}
            </Typography>
            <Typography
              variant="subtitle2"
              component="div"
              style={{
                fontSize: '0.5rem',
                width: '100%',
                letterSpacing: '0',
                color: 'red',
              }}>
              you paid ${+item.bidAmount} million
            </Typography>
          </CardContent>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: '1 0 auto',
              width: '130px',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '7px',
            }}>
            <div className={classes.btn_container}>
              <svg
                className={`${expandAuction && classes.enableTick}`}
                style={{ opacity: '0' }}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.4425 4.685L6.5 9.6275L3.8075 6.9425L2.75 8L6.5 11.75L12.5 5.75L11.4425 4.685ZM8 0.5C3.86 0.5 0.5 3.86 0.5 8C0.5 12.14 3.86 15.5 8 15.5C12.14 15.5 15.5 12.14 15.5 8C15.5 3.86 12.14 0.5 8 0.5ZM8 14C4.685 14 2 11.315 2 8C2 4.685 4.685 2 8 2C11.315 2 14 4.685 14 8C14 11.315 11.315 14 8 14Z"
                  fill="#006132"
                />
              </svg>
              <Typography
                component="button"
                variant="subtitle1"
                className={`${classes.auction_btn} ${expandAuction && classes.auction_btn_clickedGreen}`}
                onClick={() => handleClick('auction')}
                disabled={disableAll || !disableBtn}>
                Nominate to auction
              </Typography>
            </div>
            <div className={classes.btn_container}>
              <svg
                className={`${expandedMarket && classes.enableTick}`}
                style={{ opacity: '0' }}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.4425 4.685L6.5 9.6275L3.8075 6.9425L2.75 8L6.5 11.75L12.5 5.75L11.4425 4.685ZM8 0.5C3.86 0.5 0.5 3.86 0.5 8C0.5 12.14 3.86 15.5 8 15.5C12.14 15.5 15.5 12.14 15.5 8C15.5 3.86 12.14 0.5 8 0.5ZM8 14C4.685 14 2 11.315 2 8C2 4.685 4.685 2 8 2C11.315 2 14 4.685 14 8C14 11.315 11.315 14 8 14Z"
                  fill="#001AA4"
                />
              </svg>
              <Typography
                variant="subtitle1"
                component="button"
                className={`${classes.auction_btn} ${expandedMarket && classes.auction_btn_clickedBlue}`}
                onClick={() => handleClick('market')}
                disabled={disableAll || disableBtn}>
                sell to market
              </Typography>
            </div>
          </CardContent>
        </Box>
      </CardContent>
      <Collapse in={(expandAuction || expandedMarket) && !bidDone} timeout="auto" sx={{ position: 'absolute', zIndex: '5' }} className={classes.auction_drop}>
        <CardContent>
          <TextField
            className={classes.form}
            name="auctionAmount"
            label="Auction Amount"
            variant="outlined"
            value={auctionPrice}
            error={!!error}
            // helperText={error}
            onChange={(e) => {
              console.log(e.target);
              setAuctionPrice(e.target.value);
            }}
          />
          <p style={{ fontSize: '.7rem', color: '#CACACA' }}>*Price range between $1 - $999</p>
        </CardContent>
        <Button
          variant="contained"
          buttonStyle={{ borderRadius: '100px' }}
          style={{
            backgroundColor: '#E36A3D',
            color: 'white',
            display: 'flex',
            marginBottom: '10px',
            margin: '15px auto',
            padding: '10px 24px',
            borderRadius: '100px',
            height: '32px',
            width: '80%',
          }}
          onClick={setAuctionPriceHandler}>
          Set Auction Price
        </Button>
      </Collapse>
    </Card>
  );
}

export default Painting;
