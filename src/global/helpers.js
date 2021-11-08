export const formatNumberToCurrency = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'usd',
}).format(value);

export const validateCurrentBid = (value) => {
  if (!value) return false;
  const regex = /^[0-9]+$/;
  if (!value.match(regex)) return false;
  if (value > 10000000) return false;
  return true;
};
