export const formatNumberToCurrency = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'usd',
}).format(value);

export const getTempBudget = (availableBudget, teamName, previousBids) => {
  const bids = Object.values(previousBids);
  /* eslint-disable no-restricted-syntax */
  let sum = 0;
  for (const bid of bids) {
    if (bid && bid.bidTeam === teamName) {
      sum += parseInt(bid.bidAmount, 10);
    }
  }
  return availableBudget - sum;
};

export const validateCurrentBid = (value, currTempBudget) => {
  if (!value || value <= 0) return 'Your bid should be a valid number';
  const regex = /^[0-9]+$/;
  if (!value.match(regex)) return 'Your bid should be a valid number';
  if (value > 999) return 'Your bid should be a valid number';
  if (value > currTempBudget) return 'Your bid should be less than or equal to total cash';
  return null;
};
