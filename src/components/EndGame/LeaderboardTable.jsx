/* eslint-disable react/prop-types */
/* eslint-disable object-curly-newline */
import React from 'react';
import { Table, TableBody, TableRow, TableHead, TableContainer, Paper, TableCell } from '@material-ui/core';
import { TEAM_COLOR_MAP } from '../../global/constants';

const TeamCircle = ({ teamName }) => (
  <>
    <div
      style={{
        borderRadius: '50%',
        height: '1.5rem',
        width: '1.5rem',
        backgroundColor: TEAM_COLOR_MAP[teamName],
      }}
    />
  </>
);

const LeaderboardTable = ({ leaderboard }) => (
  <>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: '700' }}>Rank</TableCell>
            <TableCell style={{ fontWeight: '700' }}>Team Profile</TableCell>
            <TableCell align="right" style={{ fontWeight: '700' }}>
              Cash
            </TableCell>
            <TableCell align="right" style={{ fontWeight: '700' }}>
              Cash points
            </TableCell>
            <TableCell align="right" style={{ fontWeight: '700' }}>
              Visits
            </TableCell>
            <TableCell align="right" style={{ fontWeight: '700' }}>
              Classify Points
            </TableCell>
            <TableCell align="right" style={{ fontWeight: '700' }}>
              Total
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(leaderboard).map((teamName, index) => (
            <TableRow key={teamName} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {`#${index + 1}`}
              </TableCell>
              <TableCell align="right">
                <TeamCircle teamName={teamName} />
              </TableCell>
              <TableCell align="right">{leaderboard[teamName].cash}</TableCell>
              <TableCell align="right">{leaderboard[teamName].cashPoints}</TableCell>
              <TableCell align="right">{leaderboard[teamName].visits}</TableCell>
              <TableCell align="right">{leaderboard[teamName].allClassifyPoints}</TableCell>
              <TableCell align="right">{leaderboard[teamName].total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </>
);

export default LeaderboardTable;
