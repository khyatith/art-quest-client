import React, { useEffect, useState } from 'react';
import { socket } from '../global/socket';
import FirstPriceSealedBid from './auctions/FirstPriceSealedBid';
import EnglishAuction from './auctions/EnglishAuction';
import LeaderBoard from './LeaderBoard';

function LiveAuctions({ getNextAuctionObj }) {
  const [auctionObj, setAuctionObj] = useState();

  useEffect(() => {
    socket.on('startNextAuction', (auctionObjFromServer) => {
      console.log(auctionObjFromServer);
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
          <>
            <FirstPriceSealedBid newAuctionObj={auctionObj} renderNextAuction={nextAuctionObj} />
            <LeaderBoard />
          </>
        );
      case '2':
        return (
          <>
            <EnglishAuction newAuctionObj={auctionObj} renderNextAuction={nextAuctionObj} />
            <LeaderBoard />
          </>
        );
      default:
        return null;
    }
  };

  return <>{auctionObj && loadAuction()}</>;
}

export default LiveAuctions;
