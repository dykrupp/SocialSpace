import React, { useContext } from 'react';
import NewsFeed from '../../NewsFeed';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { AuthUserContext } from '../../Authentication/AuthProvider/context';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    minWidth: '760px',
  },
  gridContainer: {
    width: '740px',
    marginLeft: '10px',
    marginRight: '10px',
  },
}));

const Home: React.FC = () => {
  const classes = useStyles();
  const authUser = useContext(AuthUserContext);

  if (!authUser) return null;
  return (
    <div className={classes.root}>
      <Grid container className={classes.gridContainer}>
        <NewsFeed isProfileFeed={false} userUID={authUser.uid} />
      </Grid>
    </div>
  );
};

export default Home;
