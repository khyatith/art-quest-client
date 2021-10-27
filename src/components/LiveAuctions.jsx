import React, { useEffect, useState, useContext } from 'react';
import { socket } from '../global/socket';
import FirstPriceSealedBid from './auctions/FirstPriceSealedBid';
import EnglishAuction from './auctions/EnglishAuction';
import EndBuyingPhase from './EndBuyingPhase';
import SecondPriceSealedBid from './auctions/SecondPriceSealedBid';
import AllPayAuctions from './auctions/AllPayAuctions';
import userContext from '../global/userContext';
import LocationPhase from './selling/LocationPhase';

function LiveAuctions({ getNextAuctionObj }) {
  const [auctionObj, setAuctionObj] = useState();
  const [hasEndedAuctions, setHasEndedAuctions] = useState(true); // Make it false (IMPORTANT)
  const { player } = useContext(userContext);

  useEffect(() => {
    socket.on('startNextAuction', (auctionObjFromServer) => {
      if (auctionObjFromServer && auctionObjFromServer.auctionState !== 2) {
        setAuctionObj(auctionObjFromServer);
      } else if (!auctionObjFromServer) {
        setAuctionObj(null);
        setHasEndedAuctions(true);
        leaderboardSocket.emit('getWinner', player);
      }
    });
  }, []);

  const nextAuctionObj = () => {
    getNextAuctionObj(auctionObj);
  };

  const loadAuction = () => {
    const { auctionType } = auctionObj;
    switch (auctionType) {
      case '1':
        return (
          <FirstPriceSealedBid newAuctionObj={auctionObj} renderNextAuction={nextAuctionObj} />
        );
      case '2':
        return (
          <EnglishAuction newAuctionObj={auctionObj} renderNextAuction={nextAuctionObj} />
        );
      case '3':
        return (
          <SecondPriceSealedBid newAuctionObj={auctionObj} renderNextAuction={nextAuctionObj} />
        );
      case '4':
        return (
          <AllPayAuctions newAuctionObj={auctionObj} renderNextAuction={nextAuctionObj} />
        );
      default:
        return null;
    }
  };

  return (
    /* Enable it (IMPORTANT)
    <>
      {auctionObj && loadAuction()}
    <>
      {hasEndedAuctions && <EndBuyingPhase />}
    </>*/
    <>
      <LocationPhase />
    </>
  );
}

export default LiveAuctions;
