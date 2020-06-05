import React from 'react';
import NewsFeed from '../../NewsFeed';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    width: '750px',
    margin: '0 auto',
  },
}));

const Home: React.FC = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <NewsFeed isUserPostsOnly={true} />
    </Grid>
  );
};

export default Home;
