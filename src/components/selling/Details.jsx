import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import userContext from '../../global/userContext';
  
function Details() {
    const [mapValues, setMapValues] = useState({});
    const { player } = useContext(userContext);

    
    //Hooks and methods
    useEffect(() => {
      async function getLocVal() {
        const newData = await axios.get(`http://localhost:3001/landing-page/getSellingResults/${player.hostCode}`);
        setVisits(newData.data.visits);
      }
    getLocVal();
    }, []);

    return (
      <div>
          
      </div>
    );
  }
  
  
  
  export default Details;