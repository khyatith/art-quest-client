import React, { useEffect, useState } from 'react';
import { socket } from '../global/socket';
import FirstPriceSealedBid from './auctions/FirstPriceSealedBid';
import TestAuction from './auctions/TestAuction';

function LiveAuctions({ getNextAuctionObj }) {
  const [auctionObj, setAuctionObj] = useState();

  useEffect(() => {
    socket.on('startNextAuction', (auctionObjFromServer) => {
      if (auctionObjFromServer && auctionObjFromServer.auctionState !== 2) {
        setAuctionObj(auctionObjFromServer);
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
          <TestAuction newAuctionObj={auctionObj} renderNextAuction={nextAuctionObj} />
        );
      default:
        return null;
    }
  };

  return <>{auctionObj && loadAuction()}</>;
}

export default LiveAuctions;
