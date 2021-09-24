import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { leaderboardSocket } from '../global/socket';
import userContext from '../global/userContext';

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

function EndBuyingPhase() {
  const classes = useStyles();
  const [artforTeams, setArtForTeams] = useState();
  const { player } = useContext(userContext);

  useEffect(() => {
    leaderboardSocket.on('leaderboard', (leaderboard) => {
      const { teamName } = player;
      const allTeamArt = leaderboard[teamName];
      setArtForTeams(allTeamArt);
    });
  }, []);

  return (
    <>
      <h5>Congratulations! For winning all this art and creating your favorite art collection!</h5>
      <div className={classes.root}>
        <ImageList rowHeight={300} className={classes.imageList}>
          {
            artforTeams
            && artforTeams.map((item) => {
              const { auctionObj } = item;
              return (
                <ImageListItem key={item.auctionId}>
                  <img key={item.auctionId} src={auctionObj.imageURL} alt={auctionObj.name} />
                </ImageListItem>
              );
            })
          }
        </ImageList>
      </div>
    </>
  );
}

export default EndBuyingPhase;
