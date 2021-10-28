import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";

function generateLine(x1, y1, x2, y2) {
    var x = (x1 - x2);
    var y = (y1 - y2);
    x = x / 361;
    y = y / 361;
    return new Array(361).fill(1).map((d, i) => {
        return [x1 - (x * i), y1 - (y * i)];
    });
}

function Mapping() {
    const [mapValues, setMapValues] = useState({});
    const [valRet, setValRet] = useState(false);
    const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";


    //Hooks and methods
    useEffect(() => {
        async function getMapVal() {
            const { data } = await axios.get(`http://localhost:3001/landing-page/getMap`);
            setMapValues(data);
        }
        if (!valRet) {
            getMapVal();
            setValRet(true);
        }
    }, []);

    return (
        <div>
            <div style={{ width: '65%', borderWidth: '2', borderStyle: 'solid', borderColor: 'black',borderRadius: '2%',marginLeft:'10%' }}>
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
                        const totalCon = items[1].allowedToVisit;
                        return (
                            <>
                                {totalCon.map(loc => {
                                    let obj = mapValues.find(x => x.cityId === loc);
                                    if (typeof (obj) == 'undefined') {
                                        console.log(loc);
                                        return (
                                            <>
                                            </>
                                        );
                                    }
                                    else {
                                        return (
                                            <Line className="cline"
                                                coordinates={generateLine(obj.longitude, obj.latitude, items[1].longitude, items[1].latitude)}
                                                stroke="#000000"
                                                strokeWidth={10}
                                            />
                                        );
                                    }
                                })}
                            </>
                        );
                    })}
                    {Object.entries(mapValues).map(items => {
                        return (
                            <Marker id={items[1].cityName} coordinates={[items[1].longitude, items[1].latitude]}>
                                <circle r={items[1].demand + 20} fill="#000000" />
                                <text textAnchor="middle" fill="#FFF" fontSize="12px">
                                    {items[1].cityName}
                                </text>
                                <text y="15" textAnchor="middle" fill="#FFF" fontSize="12px">
                                    {items[1].demand + "M"}
                                </text>
                            </Marker>
                        );
                    })}
                </ComposableMap>
            </div>
        </div>
    );
}



export default Mapping;