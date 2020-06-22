import React from 'react';
import { makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    width: '25%',
    margin: '0 auto',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  circularProgress: {
    marginLeft: '10px',
  },
}));

export const IsLoading = (): JSX.Element => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item>
        <h1>Loading</h1>
      </Grid>
      <Grid item>
        <CircularProgress color="primary" />
      </Grid>
    </Grid>
  );
};
