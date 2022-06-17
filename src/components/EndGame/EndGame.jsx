/* eslint-disable object-curly-newline */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable no-unused-vars */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
import { Paper } from '@material-ui/core';
import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { API_URL, TEAM_COLOR_MAP } from '../../global/constants';
import Header from '../Header';
import ClassifyChart from './ClassifyChart';
import LeaderboardTable from './LeaderboardTable';
import Painting from './Painting';
import useSessionStorage from '../../hooks/useSessionStorage';

const artMovementColors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(250, 154, 85)', 'rgb(69, 91, 255)', 'rgb(69, 255, 212)'];

const EndGame = () => {
  const location = useLocation();
  // const player = useSessionStorage('user')[0];
  const loggedInTeam = 'Blue';
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [ChartData, setChartData] = useState([]);
  const [ownedPaintings, setOwnedPaintings] = useState([]);
  const [winningTeam, setWinningTeam] = useState('');

  const handleFetchFinalResult = async () => {
    const roomCode = location.pathname.split('/')[2];
    const response = await axios({
      url: `${API_URL}/buying/finalResult/${roomCode}/${loggedInTeam}`,
      method: 'GET',
    });

    const { leaderboard, classifyPoints, amountSpentByTeams, totalObj, visitsPrice, allClassifyPoints, winner } = response.data;
    setWinningTeam(winner);
    const leaderboardTableObj = {};
    let tempChartData = {};
    const tempPaintings = [];

    Object.keys(leaderboard)?.map((teamName) => {
      leaderboardTableObj[teamName] = {
        classifyPoints: classifyPoints[teamName],
        cash: amountSpentByTeams[teamName],
        visits: visitsPrice[teamName],
        total: totalObj[teamName],
        allClassifyPoints: allClassifyPoints.classify[teamName],
      };

      tempChartData = {
        labels: Object.keys(classifyPoints),
        datasets: [{ data: Object.values(classifyPoints), backgroundColor: artMovementColors, hoverOffset: 4 }],
      };

      if (teamName === loggedInTeam) {
        tempPaintings.push(leaderboard[teamName]?.map((ob) => ob.imageURL));
      }
    });

    setLeaderboardData(leaderboardTableObj);
    setChartData(tempChartData);
    setOwnedPaintings(tempPaintings);
  };

  useEffect(() => {
    handleFetchFinalResult();
  }, []);

  return (
    <div>
      <Header />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}>
        <Paper elevation={3} style={{ width: '80%', marginTop: '1.5rem' }}>
          <div
            style={{
              width: '100%',
            }}>
            <LeaderboardTable leaderboard={leaderboardData} />
          </div>
        </Paper>
      </div>

      {winningTeam && (
        <div style={{ textAlign: 'center' }}>
          {winningTeam === loggedInTeam ? <h2>Congratulations you have won the game!</h2> : <h2>{`${winningTeam} team has won the game!`}</h2>}
        </div>
      )}

      <div style={{ display: 'flex', width: '100%', justifyContent: 'center', paddingBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            marginTop: '2rem',
            width: '80%',
          }}>
          {Object.keys(ChartData).length !== 0 && (
            <Paper elevation={3}>
              <h3 style={{ textAlign: 'center', fontWeight: '100' }}>Classify points details</h3>
              <ClassifyChart classifyPoints={ChartData} />
            </Paper>
          )}

          <Paper elevation={3} style={{ marginLeft: '10%' }}>
            {ownedPaintings.length !== 0 && (
              <>
                <h3 style={{ textAlign: 'center', fontWeight: '100' }}>Your painting collection</h3>
                <div style={{ width: '100%', height: '25rem', overflow: 'auto' }}>
                  <Paper elevation={3}>
                    <Painting data={ownedPaintings} />
                  </Paper>
                </div>
              </>
            )}
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default EndGame;
