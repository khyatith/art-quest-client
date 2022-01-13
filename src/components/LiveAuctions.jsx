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
import RenderAuctionResults from './RenderAuctionResults';

function LiveAuctions({ fromLP }) {
  const [hasEndedAuctions, setHasEndedAuctions] = useState(false);
  const allAuctionsObj = useSessionStorage('allAuction')[0];
  const [isFromLP, getFromLP] = useState(fromLP);
  const [totalNumberOfPaintings, setTotalNumberOfPaintings] = useState();
  const [renderResults, setIsRenderResults] = useState(false);
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
    setIsRenderResults(false);
  }, [hasEndedAuctions, setCurrentAuctionData, allAuctionsObj]);

  useEffect(() => {
    const { artifacts } = allAuctionsObj?.auctions;
    setTotalNumberOfPaintings(artifacts.length);
  }, [allAuctionsObj]);

  useEffect(() => {
    if (isFromLP) {
      getNextAuctionObj();
      getFromLP(false);
    }
  }, [isFromLP, getNextAuctionObj]);

  const goToAuctionResult = (value) => {
    setIsRenderResults(value);
  };

  const loadAuction = () => {
    const { auctionType } = currentAuctionData && currentAuctionData.currentAuctionObj;
    switch (auctionType) {
      case '1':
        return (
          <FirstPriceSealedBid
            getNextAuctionObj={getNextAuctionObj}
            totalNumberOfPaintings={totalNumberOfPaintings}
            goToAuctionResult={goToAuctionResult}
          />
        );
      case '2':
        return (
          <EnglishAuction
            getNextAuctionObj={getNextAuctionObj}
            totalNumberOfPaintings={totalNumberOfPaintings}
            goToAuctionResult={goToAuctionResult}
          />
        );
      case '3':
        return (
          <SecondPriceSealedBid
            getNextAuctionObj={getNextAuctionObj}
            totalNumberOfPaintings={totalNumberOfPaintings}
            goToAuctionResult={goToAuctionResult}
          />
        );
      case '4':
        return (
          <AllPayAuctions
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
      {!hasEndedAuctions && currentAuctionData && currentAuctionData.currentAuctionObj && !renderResults && loadAuction()}
      {renderResults && <RenderAuctionResults getNextAuctionObj={getNextAuctionObj} goToAuctionResult={goToAuctionResult} />}
      {hasEndedAuctions && <EndBuyingPhase />}
    </>
  );
}

LiveAuctions.propTypes = {
  fromLP: PropTypes.bool.isRequired,
};

export default LiveAuctions;
