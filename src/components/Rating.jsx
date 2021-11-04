import React from 'react';
import PropTypes from 'prop-types';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

export default function SimpleRating({ rating }) {
  return (
    rating
    && (
    <div>
      <Box component="fieldset" mb={3} borderColor="transparent">
        <Rating size="large" name="read-only" value={rating} max={5} precision={0.1} readOnly />
      </Box>
    </div>
    )
  );
}

SimpleRating.defaultProps = {
  rating: 3,
};

SimpleRating.propTypes = {
  rating: PropTypes.number,
};
