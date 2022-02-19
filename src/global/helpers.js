export const formatNumberToCurrency = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'usd',
}).format(value);

export const validateCurrentBid = (value) => {
  if (!value || value <= 0) return false;
  const regex = /^[0-9]+$/;
  if (!value.match(regex)) return false;
  if (value > 999) return false;
  return true;
};
