/* eslint-disable import/prefer-default-export */
import axios from 'axios';

export const getNextAuctionObj = async (currentAuctionObj, player) => {
  const currentAuctionId = currentAuctionObj && currentAuctionObj.id;
  const { data } = await axios.get(`http://localhost:3001/buying/getNextAuction/${player.hostCode}/${currentAuctionId}`);
  return data;
  // socket.emit('startLiveAuctions', { currentAuctionObj, player });
};
