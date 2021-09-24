import React, { useEffect, useState } from 'react';
import { socket } from '../global/socket';
import FirstPriceSealedBid from './auctions/FirstPriceSealedBid';
import EnglishAuction from './auctions/EnglishAuction';
import EndBuyingPhase from './EndBuyingPhase';

function LiveAuctions({ getNextAuctionObj }) {
  const [auctionObj, setAuctionObj] = useState();
  const [hasEndedAuctions, setHasEndedAuctions] = useState(false);

  useEffect(() => {
    socket.on('startNextAuction', (auctionObjFromServer) => {
      if (auctionObjFromServer && auctionObjFromServer.auctionState !== 2) {
        setAuctionObj(auctionObjFromServer);
      } else if (!auctionObjFromServer) {
        setAuctionObj(null);
        setHasEndedAuctions(true);
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
      default:
        return null;
    }
  };

  return (
    <>
      {auctionObj && loadAuction()}
      {hasEndedAuctions && <EndBuyingPhase />}
    </>
  );
}

export default LiveAuctions;
