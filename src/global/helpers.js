const formatNumberToCurrency = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'usd',
}).format(value);

export default formatNumberToCurrency;
