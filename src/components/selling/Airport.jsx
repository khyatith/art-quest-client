

// Airport 

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import userContext from '../../global/userContext';

function Airport() {
    const [mapValues, setMapValues] = useState({});
    const [teamValues, setTeamValues] = useState({});
    const [valRet, setValRet] = useState(false);
    const { player , setPlayer } = useContext(userContext);
    const loc = player.currentLocation;


    //Hooks and methods
    useEffect(() => {
        async function getMapVal() {
            const { data } = await axios.get(`http://localhost:3001/landing-page/getMap`);
            setMapValues(data);
            console.log(player.currentLocation);
        }
        if (!valRet) {
            getMapVal();
            setValRet(true);
        }
    }, []);

    return (
        <div>
            <div>
                <p>Currently in: {loc}</p>
                <p>Fly to : </p>
                {Object.entries(mapValues).map(items => {
                    const totalCon = items[1].allowedToVisit;
                    if (items[1].cityName === loc) {
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
                <button type="submit" style={{ padding: '2%', backgroundColor: 'black', color: 'white', width: '22%', marginTop: '8%' }}>
                    Submit
                </button>
            </div>
        </div>
    );
}



export default Airport;
