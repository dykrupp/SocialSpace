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
    width: '750px',
    marginLeft: '20px',
    marginRight: '20px',
    marginBottom: '20px',
  },
}));

const Home: React.FC = () => {
  const classes = useStyles();
  const authUser = useContext(AuthUserContext);

  if (!authUser) return null;
  return (
    <div className={classes.root}>
      <Grid container className={classes.gridContainer}>
        <NewsFeed userProfile={null} userUID={authUser.uid} />
      </Grid>
    </div>
  );
};

export default Home;
