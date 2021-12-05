import React from 'react';
import PropTypes from 'prop-types';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

export default function SimpleRating({ rating }) {
  return (
    rating
    && (
    <Box component="fieldset" borderColor="transparent">
      <Rating size="large" name="read-only" value={rating} max={5} precision={0.1} readOnly />
    </Box>
    )
  );
}

SimpleRating.propTypes = {
  rating: PropTypes.number.isRequired,
};
