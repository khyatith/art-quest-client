/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// eslint-disable-next-line object-curly-newline
import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps';
import { API_URL } from '../../global/constants';

function generateLine(x1, y1, x2, y2) {
  let x = x1 - x2;
  let y = y1 - y2;
  x /= 361;
  y /= 361;
  return new Array(361).fill(1).map((d, i) => [x1 - x * i, y1 - y * i]);
}

function Mapping({ teamLocations, disabledLocations }) {
  const [mapValues, setMapValues] = useState({});
  const [valRet, setValRet] = useState(false);
  const geoUrl = 'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';

  // Hooks and methods
  useEffect(() => {
    async function getMapVal() {
      const { data } = await axios.get(`${API_URL}/buying/getMap`);
      setMapValues(data);
    }
    if (!valRet) {
      getMapVal();
      setValRet(true);
    }
  }, [valRet]);
  console.log('->', teamLocations);
  console.log('map ->', mapValues);

  return (
    <>
      <div
        style={{
          width: '100%',
          marginLeft: '5%',
          // eslint-disable-next-line react/jsx-closing-bracket-location
        }}>
        <ComposableMap>
          <Geographies geography={geoUrl} fill="#D6D6DA" stroke="#FFFFFF" strokeWidth={0.5}>
            {({ geographies }) => geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} />)}
          </Geographies>
          {Object.entries(mapValues).map((items) => {
            const totalCon = items[1].allowedToVisit;
            return (
              <>
                {totalCon.map((loc) => {
                  const obj = mapValues.find((x) => x.cityId === loc);
                  if (typeof obj === 'undefined') {
                    return <></>;
                  }
                  return (
                    <Line
                      key={loc}
                      className="cline"
                      coordinates={generateLine(obj.longitude, obj.latitude, items[1].longitude, items[1].latitude)}
                      stroke="#000000"
                      strokeWidth={10}
                    />
                  );
                })}
              </>
            );
          })}
          {Object.entries(mapValues).map((items) => (
            <Marker id={items[1].cityName} key={items[1].cityId} coordinates={[items[1].longitude, items[1].latitude]}>
              <circle
                r={items[1].transportCost / 100000 + 35}
                fill={disabledLocations.includes(items[1].cityId) ? '#cccccc' : '#000000'}
                margin="45px"
                style={{ margin: '45px' }}
              />
              <text textAnchor="middle" fill="#FFF" fontSize="12px" fontWeight="700">
                {items[1].cityName}
              </text>
              <text y="15" textAnchor="middle" fill="#FFF" fontSize="12px" fontWeight="700">
                {`$${items[1].transportCost.toLocaleString()}`}
              </text>
            </Marker>
          ))}
          {
          Array.isArray(mapValues) && teamLocations && teamLocations?.map((items, idx) => {
            console.log('map of team cities', items);
            const location = mapValues?.filter((item) => (
              item.cityId === items.locationId
            ));
            console.log('found loc->', location);
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Marker key={idx} coordinates={[location[0].longitude, location[0].latitude]}>
                <circle r={10} fill={items.color.toLowerCase()} stroke="#fff" strokeWidth={2} />
              </Marker>
            );
          })
          }
        </ComposableMap>
      </div>
    </>
  );
}

export default Mapping;
