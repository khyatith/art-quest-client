import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import fontawesome from '@fortawesome/fontawesome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/fontawesome-free-solid';
import leaderboardImg from '../assets/leaderboardimg.png';
import { leaderboardSocket } from '../global/socket';
import { TEAM_DETAILS } from '../global/constants';

const useStyles = makeStyles((theme) => ({
  drawerStyle: {
    '& .MuiDrawer-paper': {
      top: 'auto',
      width: '400px',
    },
  },
  avatar: {
    height: '80px',
    width: '80px',
    left: '-20px',
  },
  title: {
    fontWeight: '700',
    marginLeft: '-20px',
  },
  listheaderstyle: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  listSection: {
    backgroundColor: 'inherit',
    marginBottom: '10px',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  listitemscontainer: {
    display: 'flex',
    padding: '10px',
  },
}));

fontawesome.library.add(faCoins);

export default function LeaderBoard({ hasAuctionTimerEnded }) {
  const classes = useStyles();
  const [leaderboardData, setLeaderboardData] = useState({});
  const [totalAmountForAllTeams, setTotalAmountByTeam] = useState([]);

  useEffect(() => {
    if (hasAuctionTimerEnded) {
      leaderboardSocket.on('leaderboard', ({ leaderboard, totalAmountByTeam }) => {
        setLeaderboardData(leaderboard);
        setTotalAmountByTeam(totalAmountByTeam);
      });
    }
  });

  const getLeaderboard = () => {
    if (!leaderboardData) return <></>;
    return Object.entries(leaderboardData).map((entry) => {
      const teamName = entry[0];
      const teamResult = entry[1];
      const winTeam = TEAM_DETAILS.filter((detail) => detail.name === teamName.toString());
      const teamColor = winTeam.length && winTeam[0].color;
      return (
        <>
          <List className={classes.listheaderstyle} subheader={<li />}>
            <li key="section-1" className={classes.listSection}>
              <ul className={classes.ul}>
                <ListSubheader style={{
                  backgroundColor: `${teamColor}`, fontSize: '15px', color: '#000000', display: 'flex',
                }}
                >
                  <div style={{ flexGrow: '1', width: '70%', fontWeight: '700' }}>
                    Team
                    {' '}
                    {teamName}
                  </div>
                  {
                    totalAmountForAllTeams && totalAmountForAllTeams.map((teamsAmounts) => {
                      const amt = teamsAmounts[`${teamName}`];
                      return (
                        <div style={{ flexGrow: '1', lineHeight: '1.8' }}>
                          <h5 style={{ lineHeight: '0.5' }}>Total Loan:</h5>
                          <FontAwesomeIcon
                            style={{
                              flex: '1', width: '18px', height: '18px', marginRight: '6px',
                            }}
                            icon="coins"
                          />
                          -
                          {amt}
                        </div>
                      );
                    })
                  }
                </ListSubheader>
                {
                teamResult.map((result) => {
                  const { auctionObj, bidAmount } = result;
                  const paintingImg = auctionObj.imageURL;
                  const paintingName = auctionObj.name;
                  const paintingArtist = result.auctionObj.artist;
                  return (
                    <div className={classes.listitemscontainer}>
                      <ListItemAvatar>
                        <Avatar alt="painting-img" src={paintingImg} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={paintingName}
                        secondary={(
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              {paintingArtist}
                            </Typography>
                          </>
                          )}
                      />
                      <div style={{ display: 'flex' }}>
                        <FontAwesomeIcon
                          style={{
                            flex: '1', marginTop: '20px', width: '20px', height: '20px',
                          }}
                          icon="coins"
                        />
                        <p style={{ flex: '1', marginLeft: '10px' }}>
                          -
                          {bidAmount}
                        </p>
                      </div>
                    </div>
                  );
                })
              }
              </ul>
            </li>
          </List>
          <Divider />
        </>
      );
    });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        className={classes.drawerStyle}
        variant="permanent"
        anchor="right"
      >
        <Toolbar>
          <>
            <Avatar aria-label="trophy" className={classes.avatar} src={leaderboardImg} />
            <Typography component="h6" variant="h6" className={classes.title}>
              Results
            </Typography>
          </>
        </Toolbar>
        <Divider />
        {leaderboardData ? getLeaderboard() : <p>Results will update here</p>}
      </Drawer>
    </Box>
  );
}
