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
import { TEAM_COLOR_MAP } from '../../global/constants';

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

function createData(team, cash) {
  let str = [];
  str.push(cash);
  console.log(str);
  return {
    label: team, backgroundColor: TEAM_COLOR_MAP[team],
    borderColor: 'rgba(0,0,0,1)',
    borderWidth: 2, data: str
  };
}

function LocationPhase() {
  const classes = useStyles();
  const [mapValues, setMapValues] = useState({});
  const [teamValues, setTeamValues] = useState({});
  const [valRet, setValRet] = useState(false);
  const [visited, setVisits] = useState({});
  const [rows, setRows] = useState([]);
  const [labels, setLabel] = useState(['Revenue']);
  const [result, setResult] = useState({});
  const { player } = useContext(userContext);
  const [loading, setLoading] = useState(true);
  const loc = player.currentLocation;
  let datasets = [];
  const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";


  //Hooks and methods
  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3001/landing-page/getSellingResults/${player.hostCode}`)
    .then((newData) => {
      setTeamValues(newData);
      console.log(newData.data);
      let x = 1;
      for (let i of Object.keys(newData.data.amountSpentByTeam)) {
        let team = i;
        let cash = newData.data.amountSpentByTeam[i];
        datasets.push(createData(team, cash));
        x += 1;
      }
      setResult({ labels, datasets });
      console.log(result);
    })
    .finally(() => {
      setLoading(false);
    })
  }, []);

    if(loading) {
      return (<div> LOADING... </div>);
    }

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
            <Item>
                <BarGraph result={result} />
            </Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}



export default LocationPhase;