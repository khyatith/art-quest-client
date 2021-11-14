import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import userContext from '../../global/userContext';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions  } from '@mui/material';
import { API_URL, TEAM_COLOR_MAP } from '../../global/constants';
import './styling.css';
import load from '../../assets/load.webp';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '40px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

function createData(team, cash, vis) {
  let str = [];
  str.push(cash / 10000);
  str.push(vis);
  console.log(str);
  return {
    label: team, backgroundColor: TEAM_COLOR_MAP[team],
    borderColor: 'rgba(0,0,0,1)',
    maxBarThickness: 60,
    borderWidth: 2, data: str
  };
}

function createDataMap(id, team, visits, cash) {
  return { id, team, visits, cash };
}


function ExpoBeginning() {
  const classes = useStyles();
  const [location, setLocation] = useState([]);
  const [paintings, setPaintings] = useState([]);
  const { player } = useContext(userContext);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  let datasets = [];
  const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";


  //Hooks and methods
  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/buying/getSellingInfo?roomId=${player.hostCode}&locationId=1&teamName=${player.teamName}`)
      .then((newData) => {
        setPaintings(newData.data.artifacts);
        setTeams(newData.data.otherteams);
      })
      .finally(() => {
        setLoading(false);
      })
  }, []);

  if (loading) {
    return (<div style={{ marginTop: '12%', marginLeft: '43%' }}> <img src={load} alt="loading..." /> </div>);
  }

  return (
    <div class="parent">
      <div class="child3">
        <div style={{margin: 'auto'}}>Step 1:Choose the painting to display in the museum today</div>
        {
          paintings.map((arg) => {
            return (
              <Card sx={{ maxWidth: 345, backgroundColor: 'white', margin: 'auto', marginTop: '3%' }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    image={arg.auctionObj.imageURL}
                    alt="green iguana"
                  />
                </CardActionArea>
                <CardActions>
                  <Button size="small" color="secondary">
                    SELECT
                  </Button>
                </CardActions>
              </Card>
            )
          })
        }
      </div>
      <div class="child4">
        {
          teams.map((arg) => {
            return (
              <div>Team{arg}</div>
            )
          })
        }
      </div>
    </div>
  );
}



export default ExpoBeginning;