import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  wrapper: {
    marginLeft: '100px',
    backgroundColor: 'rgb(186, 184, 184)',
  },
  heading: {
    paddingTop: '10px',
  },
  teamContainer: {
    display: 'flex',
  },
  team: {
    backgroundColor: '#87CEEB',
    borderRadius: '50%',
    height: '25px',
    width: '25px',
  },
  budgetContainer: {
    display: 'flex',
  },
}));

function BudgetHeader() {
  const classes = useStyles();

  return (
    <Card className={classes.wrapper}>
      <Typography className={classes.heading}>Your Budget</Typography>
      <CardContent className={classes.budgetContainer}>
        <Container className={classes.teamContainer}>
          <Box className={classes.team} />
          <Box>$100M</Box>
        </Container>
        <Container className={classes.teamContainer}>
          <Box className={classes.team} />
          <Box>$100M</Box>
        </Container>
      </CardContent>
    </Card>
  );
}
export default BudgetHeader;
