import React from 'react';
import { emphasize, withStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import PropTypes from 'prop-types';

const RoundsInfo = ({ label, marginTop }) => {
  const StyledBreadcrumb = withStyles((theme) => ({
    root: {
      backgroundColor: '#f50057',
      height: theme.spacing(3),
      color: '#ffffff',
      fontWeight: 700,
      marginLeft: '10px',
      marginTop: marginTop || '80px',
      fontSize: '15px',
      padding: '10px',
      '&:hover, &:focus': {
        backgroundColor: theme.palette.grey[300],
      },
      '&:active': {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(theme.palette.grey[300], 0.12),
      },
    },
  }))(Chip);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <StyledBreadcrumb component="a" label={label} />
    </Breadcrumbs>
  );
};

RoundsInfo.defaultProps = {
  marginTop: '',
};

RoundsInfo.propTypes = {
  label: PropTypes.string.isRequired,
  marginTop: PropTypes.string,
};

export default RoundsInfo;
