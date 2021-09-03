import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import { socket } from "../global/socket";
import FirstPriceSealedBid from './auctions/FirstPriceSealedBid';
import EnglishAuction from './auctions/EnglishAuction';

function LiveAuctions({ getNextAuctionObj }) {
	const [auctionObj, setAuctionObj] = useState();

	useEffect(() => {
    socket.on("startNextAuction", auctionObj => {
      if (auctionObj.auctionState !== 2) {
        setAuctionObj(auctionObj);
      }
    });
  }, [auctionObj]);

	const nextAuctionObj = () => {
		getNextAuctionObj(auctionObj);
  };
  
  const loadAuction = () => {
    const { auctionType } = auctionObj;
    switch(auctionType) {
      case '1':
        return <FirstPriceSealedBid newAuctionObj={auctionObj} />
      case '2':
        return <EnglishAuction newAuctionObj={auctionObj} />
      default:
        return null
    }
  }

	return (
		<>
			{auctionObj && loadAuction()}
			<Button onClick={nextAuctionObj}>Next</Button>
		</>
	);
}

export default LiveAuctions;
