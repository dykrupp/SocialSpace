import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  root: {
    width: '200px',
    margin: '0 auto',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: '5px',
    display: 'flex',
    flexDirection: 'column',
  },
  circularProgress: {
    marginLeft: '10px',
  },
  text: {
    fontWeight: 'bold',
  },
}));

interface IsLoadingProps {
  text: string;
}

export const IsLoading: React.FC<IsLoadingProps> = ({ text }) => {
  const classes = useStyles();

  return (
    <Grid spacing={2} container className={classes.root}>
      <Grid item>
        <Typography variant="h4" className={classes.text}>
          {text}
        </Typography>
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
