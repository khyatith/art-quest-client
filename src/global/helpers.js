const formatNumberToCurrency = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'usd',
}).format(value);

export default formatNumberToCurrency;
