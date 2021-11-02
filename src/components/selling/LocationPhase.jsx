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
  str.push(cash/10000);
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


function LocationPhase() {
  const classes = useStyles();
  const [teamValues, setTeamValues] = useState({});
  const [rows, setRows] = useState([]);
  const [labels, setLabel] = useState(['Cash','Visits']);
  const [result, setResult] = useState({});
  const { player } = useContext(userContext);
  const [loading, setLoading] = useState(true);
  let datasets = [];
  const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";


  //Hooks and methods
  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3001/buying/getSellingResults?roomId=${player.hostCode}`)
      .then((newData) => {
        setTeamValues(newData);
        console.log(newData);
        let x = 1;
        let tv = [];
        for (let i of Object.keys(newData.data.amountSpentByTeam)) {
          let team = i;
          let cash = newData.data.amountSpentByTeam[i];
          let vis = 0;
          for (let j of newData.data.visits) {
            if (j.teamName === i) {
              vis = j.visitCount;
            }
          }
          datasets.push(createData(team, cash, vis));
          tv.push(createDataMap(x, team, vis, cash));
          x += 1;
        }
        setResult({ labels, datasets });
        setRows(tv);
      })
      .finally(() => {
        setLoading(false);
      })
  }, []);

  if (loading) {
    return (<div style={{marginTop: '12%', marginLeft: '43%'}}> <img src={load} alt="loading..." /> </div>);
  }

  return (
      <div class="parent">
          <div class="child1">
          <Airport />
          </div>
          <div class="child1">
          <Mapping />
          </div>
          <div class="child2">
          <Details rows={rows} />
          </div>
          <div class="child2">
          <BarGraph result={result} />
        </div>
      </div>
  );
}



export default LocationPhase;