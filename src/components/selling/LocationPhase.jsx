import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import userContext from '../../global/userContext';
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";

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
        <form>
        <div style={{width:'17%', marginTop: '2%', marginLeft: '6%', backgroundColor: '#E0E0E0', padding: '2%', paddingTop: '1%'}}>
          <p>Currently in: {loc}</p>
          <p>Fly to : </p>
          {Object.entries(mapValues).map(items => {
            const totalCon=items[1].allowedToVisit;
            if(items[1].cityName===loc) {
            return (
              <>
                {totalCon.map(loc => {
                  let obj = mapValues.find(x => x.cityId === loc);
                  return (
                    <div>
                    <input type="radio" value={obj.cityName} name="location" /> {obj.cityName}
                    </div>
                  );
                })}
              </>
            );
            }
          })}
        <button type="submit" style={{padding: '2%', backgroundColor: 'black', color: 'white', width: '22%', marginTop: '8%'}}>
          Submit
        </button>
        </div>
        </form>
      <div style={{width:'47%' , marginLeft:'auto', marginRight:'2%', marginTop: '-14%', outline:'4px solid black'}}>  
        <ComposableMap>
        <Geographies geography={geoUrl}
        fill="#D6D6DA"
        stroke="#FFFFFF"
        strokeWidth={0.5}>
          {({ geographies }) =>
            geographies.map(geo => <Geography key={geo.rsmKey} geography={geo} />)
          }
        </Geographies>
        {Object.entries(mapValues).map(items => {
            const totalCon=items[1].allowedToVisit;
            return (
                <>
                {totalCon.map(loc => {
                let obj = mapValues.find(x => x.cityId === loc);
                return (
                    <Line className="cline"
                    coordinates={generateLine(obj.longitude, obj.latitude, items[1].longitude, items[1].latitude)}
                    stroke="#000000"
                    strokeWidth={10}
                />
                );
            })}
            </>
            );
        })}
        {Object.entries(mapValues).map(items => {
            return (
                <Marker id={items[1].cityName} coordinates={[items[1].longitude,items[1].latitude]}>
                    <circle r={items[1].demand+20} fill="#000000" />
                    <text textAnchor="middle" fill="#FFF" fontSize="12px">
                        {items[1].cityName}
                    </text>
                    <text y="15" textAnchor="middle" fill="#FFF" fontSize="12px">
                        {items[1].demand+"M"}
                    </text>
                </Marker>
            );
        })}
    </ComposableMap>
      </div>
      </div>
    );
  }
  
  
  
  export default LocationPhase;