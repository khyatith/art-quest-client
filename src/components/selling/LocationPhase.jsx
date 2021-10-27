import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import userContext from '../../global/userContext';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Airport from './Airport';
import BarGraph from './BarGraph';
import Details from './Details';
import Mapping from './Mapping';

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

function generateLine(x1,y1,x2,y2) {
    var x=(x1-x2);
    var y=(y1-y2);
    x=x/361;
    y=y/361;
    return new Array(361).fill(1).map((d, i) => {
      return [x1 - (x*i), y1- (y*i)];
    });
}
  
function LocationPhase() {
    const classes = useStyles();
    const [mapValues, setMapValues] = useState({});
    const [teamValues, setTeamValues] = useState({});
    const [valRet, setValRet] = useState(false);
    const [visited, setVisits] = useState({});
    const { player } = useContext(userContext);
    const loc=player.currentLocation;
    const geoUrl ="https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

    
    //Hooks and methods
    useEffect(() => {
      async function getMapVal() {
        const { data } = await axios.get(`http://localhost:3001/landing-page/getMap`);
        setMapValues(data);
      }
      async function getLocVal() {
        const newData = await axios.get(`http://localhost:3001/landing-page/getSellingResults/${player.hostCode}`);
        setTeamValues(newData);
        setVisits(newData.data.visits);
      }
      if(!valRet) {
        getMapVal();
        getLocVal();
        setValRet(true);
      }
    }, []);

    return (
      <div>
        <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Item><Airport /></Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <Mapping />
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <Details />
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>xs=8</Item>
        </Grid>
      </Grid>
    </Box>
      </div>
    );
  }
  
  
  
  export default LocationPhase;