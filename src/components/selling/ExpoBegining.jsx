import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Button, CardActionArea, CardActions } from '@mui/material';
import userContext from '../../global/userContext';
import { API_URL, TEAM_COLOR_MAP } from '../../global/constants';
import Header from '../Header';
import load from '../../assets/load.webp';
import SimpleRating from '../Rating';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '40px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  paintOpt: {
    backgroundColor: '#76e246',
  },
  imageList: {
    width: 500,
    height: 450,
  },
  contentstyle: {
    textAlign: 'center',
  },
  teammark: {
    height: '35px',
    width: '35px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  fontSty: {
    fontSize: 'large',
  },
  fontSty2: {
    fontSize: '27px',
    fontWeight: 'bold',
    paddingTop: '30px',
    paddingLeft: '50px',
  },
  parent: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  child1: {
    flex: '0 2 50%' /* explanation below */,
    paddingLeft: '2%',
    paddingBottom: '0.5%',
  },
  child2: {
    flex: '0 2 18%' /* explanation below */,
    marginLeft: '30%',
    textAlign: 'center',
    paddingBottom: '0.5%',
    backgroundColor: '#C4C4C4',
  },
  child4: {
    flexWrap: 'wrap',
    marginTop: '1%',
    marginBottom: '30px',
  },
  resultsText: {
    display: 'block',
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: '700',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  buttonStyle: {
    backgroundColor: '#76e246',
    color: 'black',
  },
}));

function ExpoBeginning() {
  const classes = useStyles();
  const [paintings, setPaintings] = useState([]);
  const { player } = useContext(userContext);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);

  // Hooks and methods
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/buying/getSellingInfo?roomId=${player.hostCode}&locationId=1&teamName=${player.teamName}`)
      .then((newData) => {
        setPaintings(newData.data.artifacts);
        console.log(newData);
        const ot = newData.data.otherteams;
        ot.push(player.teamName);
        setTeams(ot);
        console.log(ot);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ marginTop: '12%', marginLeft: '43%' }}>
        {' '}
        <img src={load} alt="loading..." />
        {' '}
      </div>
    );
  }

  return (
    <>
      <div className={classes.parent}>
        <div>
          <div className={classes.parent}>
            <div className={classes.child1}>
              <p className={classes.fontSty2}>Step 1 : Choose the painting to display in the museum today</p>
            </div>
            <div className={classes.child2}>
              <p className={classes.fontSty}>
                In city :
                {player.currentLocation}
              </p>
              <p className={classes.fontSty}>
                Teams in
                {player.currentLocation}
                {' '}
                :
              </p>
              {teams.map((arg) => (
                <div className={classes.teammark} style={{ backgroundColor: arg, borderRadius: '100%' }} />
              ))}
            </div>
          </div>
          <Box justifyContent="center" display="flex" flexWrap="wrap" p={1} m={1}>
            {paintings.map((arg) => (
              <Box
                p={1}
                sx={{
                  paddingLeft: '20px',
                  paddingRight: '20px',
                }}
              >
                <Card
                  sx={{
                    minHeight: 445,
                    maxHeight: 445,
                    minWidth: 355,
                    maxWidth: 355,
                    backgroundColor: 'white',
                    margin: 'auto',
                    marginTop: '3%',
                  }}
                >
                  <CardActionArea>
                    <CardMedia sx={{ height: 398 }} component="img" image={arg.auctionObj.imageURL} alt="green iguana" />
                  </CardActionArea>
                  <CardActions className={classes.paintOpt}>
                    <Button size="small" style={{ color: '#000000', fontWeight: 'bold', width: '100%' }}>
                      SELECT
                    </Button>
                  </CardActions>
                </Card>
                <div className={classes.contentstyle}>
                  <p>Painting Quality</p>
                  <SimpleRating rating={parseFloat(arg.paintingQuality)} />
                </div>
              </Box>
            ))}
          </Box>
        </div>
      </div>
    </>
  );
}

export default ExpoBeginning;
