import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';

const StyledBreadcrumb = withStyles((theme) => ({
  root: {
    // backgroundColor: '#f50057',
    height: theme.spacing(3),
    color: '#ffffff',
    fontWeight: 700,
    marginLeft: '20px',
    marginTop: '20px',
    fontSize: '15px',
    padding: '10px',
  },
}))(Chip); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

const TeamInfo = ({ label, labelColor }) => (
  <Breadcrumbs aria-label="breadcrumb">
    <StyledBreadcrumb component="a" label={label} style={{ backgroundColor: labelColor }} />
  </Breadcrumbs>
);

TeamInfo.propTypes = {
  label: PropTypes.string.isRequired,
  labelColor: PropTypes.string.isRequired,
};

export default TeamInfo;
