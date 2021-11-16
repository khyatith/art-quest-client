import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import userContext from '../../global/userContext';
import Airport from './Airport';
import BarGraph from './BarGraph';
import Details from './Details';
import Header from '../Header';
import Mapping from './Mapping';
import { API_URL, TEAM_COLOR_MAP } from '../../global/constants';
import load from '../../assets/load.webp';
import ExpoBegining from './ExpoBegining';

const useStyles = makeStyles(() => ({
  parent: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  child1: {
    flex: '0 2 50%' /* explanation below */,
    marginTop: '0.5%',
    paddingBottom: '0.5%',
    borderBottom: '0.8%',
    borderTop: '0',
    borderLeft: '0',
    borderRight: '0',
    borderColor: 'rgb(214,214,218)',
    borderStyle: 'solid',
  },
  child2: {
    flex: '0 2 48%' /* explanation below */,
    marginTop: '1%',
    marginBottom: '30px',
  },
  resultsText: {
    display: 'block',
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: '700',
  },
}));

function createData(team, cash, vis) {
  const str = [];
  str.push(cash / 10000);
  str.push(vis);
  return {
    label: team,
    backgroundColor: TEAM_COLOR_MAP[team],
    data: str,
    barThickness: 25,
  };
}

function createDataMap(id, team, visits, cash) {
  return {
    id,
    team,
    visits,
    cash,
  };
}

function LocationPhase() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [result, setResult] = useState({});
  const { player } = useContext(userContext);
  const [loading, setLoading] = useState(true);

  // Hooks and methods
  useEffect(() => {
    setLoading(true);
    const datasets = [];
    axios
      .get(`${API_URL}/buying/getSellingResults?roomId=${player.hostCode}`)
      .then((newData) => {
        const { amountSpentByTeam, visits } = newData.data;
        let x = 1;
        const tv = [];
        const labels = ['Cash', 'Visits'];
        Object.entries(amountSpentByTeam).forEach(([key, value]) => {
          const team = key;
          const cash = value;
          let vis = 0;
          const teamVisits = visits.filter((v) => v.teamName === key);
          vis = teamVisits ? teamVisits[0].visitCount : 0;
          datasets.push(createData(team, cash, vis));
          tv.push(createDataMap(x, team, vis, cash));
          x += 1;
        });
        setResult({ labels, datasets });
        setRows(tv);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [player]);

  if (loading) {
    return (
      <div style={{ marginTop: '12%', marginLeft: '43%' }}>
        {' '}
        <img src={load} alt="loading..." />
        {' '}
      </div>
    );
  }

  // IMPORTANT (KOGNITI CHANGE)

  return (
    <>
      {/*<Header />
      <div className={classes.parent}>
        <div className={classes.child1}>
          <Mapping />
        </div>
        <div className={classes.child1}>
          <Airport />
        </div>
      </div>
      <p className={classes.resultsText}>Results</p>
      <div className={classes.parent}>
        <div className={classes.child2}>
          <Details rows={rows} />
        </div>
        <div className={classes.child2}>
          <BarGraph result={result} />
        </div>
      </div>*/}
      <ExpoBegining />
    </>
  );
}

export default LocationPhase;
