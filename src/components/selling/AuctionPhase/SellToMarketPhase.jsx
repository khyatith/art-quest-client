import React, { useState, useEffect, useCallback } from 'react';
import { CardContent } from '@material-ui/core';
import axios from 'axios';
import NominatedPainting from '../../ConfirmationScreen/NominatedPainting';
import { socket } from '../../../global/socket';
import { API_URL } from '../../../global/constants';

function SellToMarketPhase({
  sellToMarketPainting, player, timerValue, classes, setShowMarketPainting,
}) {
  const [calculatedRevenue, setCalculatedRevenue] = useState('');

  useEffect(() => {
    const getEarnings = async () => {
      const { data } = await axios.get(`${API_URL}/buying/getSellToMarketResult?roomCode=${player.hostCode}&roundId=${player.roundId}`);
      return data;
    };
    if (sellToMarketPainting?.ticketPrice) {
      setShowMarketPainting(true);
      getEarnings().then((revenue) => {
        console.log('reve->', revenue[player.teamName], player);
        const rev = revenue[player.teamName]?.toFixed(2);
        if (timerValue?.total <= 5000) {
          setCalculatedRevenue(rev);
        } else {
          setTimeout(() => setCalculatedRevenue(rev), 5000);
        }
      }).catch((e) => console.log(e));
    }
  }, [sellToMarketPainting]);

  const { transportCost, ticketPrice } = sellToMarketPainting;
  const formattedTransportCost = parseInt(transportCost, 10) / 1000000;
  const realRevenue = parseFloat(calculatedRevenue) - parseFloat(formattedTransportCost);
  const mssgArray = useCallback([]);
  useEffect(() => {
    socket.on('setNominatedAuction', (previousBid) => {
      if (previousBid) {
        // updates = {
        //   bidAmount: previousBid.bidAmount,
        //   bidTeam: previousBid.bidTeam,
        //   bidColor: previousBid.bidColor,
        // };
        const mssg = `Team ${previousBid.bidTeam} bid $ ${previousBid.bidAmount} on ${previousBid.paintingName}`;
        console.log('->', mssg, previousBid);
        mssgArray.push(mssg);
      }
    });
  });
  console.log('message->', mssgArray);
  return (
    <div className={classes['sell_to_market-container']}>
      <h2>Your nominated Painting:</h2>
      <NominatedPainting classes={classes} paintingData={sellToMarketPainting} />
      <CardContent className={classes.paintOpt}>
        {
          !calculatedRevenue && <h3>Calculating your team's earning...</h3>
  }
        {
    calculatedRevenue
    && (
      <div>
        <h3>
          Your ticket price:
          $
          {ticketPrice}
          {''}
          per person
        </h3>
        <h3>
          Calculated earnings:
          $
          {calculatedRevenue}
          M
        </h3>
        <h3>
          Transportation cost:
          $
          {formattedTransportCost}
          M
        </h3>
        <h3 style={{ color: 'green' }}>
          Total earnings:
          $
          {realRevenue.toFixed(2)}
          M
        </h3>
      </div>
    )
  }
      </CardContent>
      <div />
      {/* <div className={classes['live_update-container']}>
        {mssgArray.map((mssg) => <p>{mssg}</p>)}
      </div> */}
    </div>
  );
}

export default SellToMarketPhase;
