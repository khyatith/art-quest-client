import React, { useEffect, useState } from 'react';
import { socket } from '../global/socket';
import FirstPriceSealedBid from './auctions/FirstPriceSealedBid';
import EnglishAuction from './auctions/EnglishAuction';
import EndBuyingPhase from './EndBuyingPhase';
import SecondPriceSealedBid from './auctions/SecondPriceSealedBid';
import AllPayAuctions from './auctions/AllPayAuctions';
// import userContext from '../global/userContext';

function LiveAuctions({ getNextAuctionObj, totalNumberOfPaintings }) {
  const [auctionObj, setAuctionObj] = useState();
  const [hasEndedAuctions, setHasEndedAuctions] = useState(false);
  // const { player } = useContext(userContext);

  useEffect(() => {
    socket.on('startNextAuction', (auctionObjFromServer) => {
      if (auctionObjFromServer && auctionObjFromServer.auctionState !== 2) {
        setAuctionObj(auctionObjFromServer);
      } else if (!auctionObjFromServer) {
        setAuctionObj(null);
        setHasEndedAuctions(true);
        // leaderboardSocket.emit('getWinner', player);
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
          <FirstPriceSealedBid newAuctionObj={auctionObj} renderNextAuction={nextAuctionObj} totalNumberOfPaintings={totalNumberOfPaintings} />
        );
      case '2':
        return (
          <EnglishAuction newAuctionObj={auctionObj} renderNextAuction={nextAuctionObj} totalNumberOfPaintings={totalNumberOfPaintings} />
        );
      case '3':
        return (
          <SecondPriceSealedBid newAuctionObj={auctionObj} renderNextAuction={nextAuctionObj} totalNumberOfPaintings={totalNumberOfPaintings} />
        );
      case '4':
        return (
          <AllPayAuctions newAuctionObj={auctionObj} renderNextAuction={nextAuctionObj} totalNumberOfPaintings={totalNumberOfPaintings} />
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
