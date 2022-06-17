/* eslint-disable react/prop-types */
import React from 'react';
import { Grid, Box, Paper } from '@material-ui/core';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  elevation: 0,
}));

const Painting = ({ data }) => (
  <div>
    <Box sx={{ width: '100%' }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {data[0]?.map((image) => (
          <Grid item xs={6}>
            <Item>
              <img style={{ height: '8rem', width: '12rem' }} alt="" src={image} />
            </Item>
          </Grid>
        ))}
      </Grid>
    </Box>
  </div>
);

export default Painting;
