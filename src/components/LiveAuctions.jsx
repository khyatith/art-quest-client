import React, {
  useEffect, useState, useContext, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import FirstPriceSealedBid from './auctions/FirstPriceSealedBid';
import EnglishAuction from './auctions/EnglishAuction';
import EndBuyingPhase from './EndBuyingPhase';
import SecondPriceSealedBid from './auctions/SecondPriceSealedBid';
import AllPayAuctions from './auctions/AllPayAuctions';
import auctionContext from '../global/auctionContext';
import useSessionStorage from '../hooks/useSessionStorage';

function LiveAuctions({ totalNumberOfPaintings, fromLP, allAuctions }) {
  const [hasEndedAuctions, setHasEndedAuctions] = useState(false);
  const [allAuctionsObj] = useSessionStorage('allAuctions', allAuctions);
  const [isFromLP, getFromLP] = useState(fromLP);
  const { currentAuctionData, setCurrentAuctionData } = useContext(auctionContext);

  const getNextAuctionObj = useCallback((prevAuctionId) => {
    const { artifacts } = allAuctionsObj && allAuctionsObj.auctions;
    let data;
    if (!hasEndedAuctions && !prevAuctionId) {
      // eslint-disable-next-line prefer-destructuring
      data = artifacts[0];
    } else if (!hasEndedAuctions && prevAuctionId) {
      const nextAuctionObjId = parseInt(prevAuctionId, 10) + 1;
      const newAuctionObj = artifacts.filter((item) => parseInt(item.id, 10) === nextAuctionObjId);
      // eslint-disable-next-line prefer-destructuring
      data = newAuctionObj[0];
    }
    if (data) {
      setCurrentAuctionData((prevValues) => ({
        ...prevValues,
        currentAuctionObj: data,
      }));
    } else if (!data) {
      setHasEndedAuctions(true);
    }
  }, [hasEndedAuctions, setCurrentAuctionData, allAuctionsObj]);

  useEffect(() => {
    if (isFromLP) {
      getNextAuctionObj();
      getFromLP(false);
    }
  }, [isFromLP, getNextAuctionObj]);

  const loadAuction = () => {
    const { auctionType } = currentAuctionData && currentAuctionData.currentAuctionObj;
    switch (auctionType) {
      case '1':
        return (
          <FirstPriceSealedBid
            newAuctionObj={currentAuctionData.currentAuctionObj}
            getNextAuctionObj={getNextAuctionObj}
            totalNumberOfPaintings={totalNumberOfPaintings}
          />
        );
      case '2':
        return (
          <EnglishAuction
            newAuctionObj={currentAuctionData.currentAuctionObj}
            getNextAuctionObj={getNextAuctionObj}
            totalNumberOfPaintings={totalNumberOfPaintings}
          />
        );
      case '3':
        return (
          <SecondPriceSealedBid
            newAuctionObj={currentAuctionData.currentAuctionObj}
            getNextAuctionObj={getNextAuctionObj}
            totalNumberOfPaintings={totalNumberOfPaintings}
          />
        );
      case '4':
        return (
          <AllPayAuctions
            newAuctionObj={currentAuctionData.currentAuctionObj}
            getNextAuctionObj={getNextAuctionObj}
            totalNumberOfPaintings={totalNumberOfPaintings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {!hasEndedAuctions && currentAuctionData && currentAuctionData.currentAuctionObj && loadAuction()}
      {hasEndedAuctions && <EndBuyingPhase />}
    </>
  );
}

LiveAuctions.defaultProps = {
  totalNumberOfPaintings: 1,
  fromLP: true,
  allAuctions: [],
};

LiveAuctions.propTypes = {
  totalNumberOfPaintings: PropTypes.number,
  fromLP: PropTypes.bool,
  allAuctions: PropTypes.array,
};

export default LiveAuctions;
