import React, { useContext } from 'react';
import NewsFeed from '../../NewsFeed';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { AuthUserContext } from '../../Authentication/AuthProvider/context';

const useStyles = makeStyles(() => ({
  root: {
    width: '750px',
    margin: '0 auto',
  },
}));

const Home: React.FC = () => {
  const classes = useStyles();
  const authUser = useContext(AuthUserContext);

  if (!authUser) return null;
  return (
    <Grid container className={classes.root}>
      <NewsFeed isUserPostsOnly={true} userUID={authUser.uid} />
    </Grid>
  );
};

export default Home;
