import React from 'react';
import { makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  root: {
    width: '200px',
    margin: '0 auto',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  circularProgress: {
    marginLeft: '10px',
  },
}));

interface IsLoadingProps {
  text: string;
}

export const IsLoading: React.FC<IsLoadingProps> = ({ text }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item>
        <h1>{text}</h1>
      </Grid>
      <Grid item>
        <CircularProgress color="primary" />
      </Grid>
    </Grid>
  );
};

IsLoading.propTypes = {
  text: PropTypes.string.isRequired,
};
