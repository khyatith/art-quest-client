import React, { useEffect, useContext } from 'react';
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
import axios from 'axios';
import { API_URL, TEAM_DETAILS } from '../global/constants';
import leaderboardImg from '../assets/leaderboardimg.png';
import userContext from '../global/userContext';
import SimpleRating from './Rating';
import leaderboardContext from '../global/leaderboardContext';

const useStyles = makeStyles((theme) => ({
  drawerStyle: {
    '& .MuiDrawer-paper': {
      top: 'auto',
      width: '400px',
      position: 'absolute',
      overflowY: 'scroll',
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
  const { player } = useContext(userContext);
  const { leaderboardData, setLeaderboardData } = useContext(leaderboardContext);

  useEffect(() => {
    async function fetchLeaderboard() {
      const sesStr = JSON.parse(sessionStorage.getItem('user'));
      const { data } = await axios.get(`${API_URL}/buying/getResults/${sesStr.hostCode}`);
      setLeaderboardData((prevValues) => ({
        ...prevValues,
        ...data,
      }));
    }
    if (hasAuctionTimerEnded) {
      fetchLeaderboard(player);
    }
  });

  const getLeaderboard = () => {
    const {
      leaderboard, totalAmountByTeam, totalPointsAvg,
    } = leaderboardData;
    if (!leaderboard) return <></>;
    return Object.entries(leaderboard).map((entry) => {
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
                  <div style={{ flexGrow: '1', width: '20%', fontWeight: '700' }}>
                    Team
                    {' '}
                    {teamName}
                  </div>
                  <hr width="1" size="90" />
                  <div style={{
                    flexGrow: '1', lineHeight: '1.8', marginLeft: '20px',
                  }}
                  >
                    <h5>Cash</h5>
                    <FontAwesomeIcon
                      style={{
                        flex: '1', width: '18px', height: '18px', marginRight: '6px',
                      }}
                      icon="coins"
                    />
                    -
                    {totalAmountByTeam && totalAmountByTeam[`${teamName}`]}
                  </div>
                  <div style={{ flexGrow: '1', lineHeight: '1.8', marginLeft: '10px' }}>
                    <h5 style={{ lineHeight: '1.8' }}>Total Points</h5>
                    {totalPointsAvg && totalPointsAvg[`${teamName}`]}
                  </div>
                </ListSubheader>
                {
                teamResult.map((result) => {
                  const { auctionObj, bidAmount } = result;
                  const paintingImg = auctionObj.imageURL;
                  const paintingName = auctionObj.name;
                  const paintingArtist = auctionObj.artist;
                  const paintingRating = auctionObj.paintingQuality;
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
                            <SimpleRating rating={parseFloat(paintingRating)} />
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
