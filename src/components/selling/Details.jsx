import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import userContext from '../../global/userContext';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'id', headerName: 'ID', sortable: false, width: 170, },
    { field: 'team', headerName: 'Team', width: 170, },
    { field: 'visits', headerName: 'Visits', type: 'number', width: 130 }, ,
    { field: 'cash', headerName: 'Cash', type: 'number', width: 130, },
];

function createData(id1, team1, visits1, cash1) {
    return { Id: id1, Team: team1, Visits: visits1, Cash: cash1 };
}



function Details() {
    const [mapValues, setMapValues] = useState({});
    const [teamValues, setTeamValues] = useState({});
    const [valRet, setValRet] = useState(false);
    const [visited, setVisits] = useState({});
    let [rows, setRows] = useState([{ Id: 0, Team: "-", Visits: 0, Cash: 0 }]);
    const { player } = useContext(userContext);
    const loc = player.currentLocation;
    const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";


    //Hooks and methods
    useEffect(() => {
        async function getLocVal() {
            const newData = await axios.get(`http://localhost:3001/landing-page/getSellingResults/${player.hostCode}`);
            setTeamValues(newData);
            console.log(newData.data);
            let x = 1;
            let tv=[];
            for (let i of Object.keys(newData.data.amountSpentByTeam)) {
                let team = i;
                let cash = newData.data.amountSpentByTeam[i];
                let vis = 0;
                for (let j of newData.data.visits) {
                    if (j.teamName === i) {
                        vis = j.visitCount;
                    }
                }
                tv.push(createData(x, team, vis, cash));
                x += 1;
            }
            setRows(tv);
        }
        getLocVal();
    }, []);


    return (
        <div style={{ height: 400, width: '100%' }}>
            <table>
                <tr key={"header"}>
                    {Object.keys(rows[0]).map((key) => (
                        <th>{key}</th>
                    ))}
                </tr>
                {rows.map((item) => (
                    <tr key={item.id}>
                        {Object.values(item).map((val) => (
                            <td>{val}</td>
                        ))}
                    </tr>
                ))}
            </table>
        </div>
    );
}



export default Details;