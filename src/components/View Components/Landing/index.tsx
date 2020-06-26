import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import SignUpPage from './SignUp';
import LandingInfo from './LandingInfo';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    height: 'calc(100% - 82px)',
    minWidth: '1200px',
  },
  gridContainer: {
    height: '100%',
    width: '1000px',
    margin: 'auto',
  },
  signUpGridItem: {
    width: '460px',
  },
  landingInfoGridItem: {
    width: '540px',
  },
}));

const Landing: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid spacing={3} container className={classes.gridContainer}>
        <Grid item className={classes.landingInfoGridItem}>
          <LandingInfo />
        </Grid>
        <Grid item className={classes.signUpGridItem}>
          <SignUpPage />
        </Grid>
      </Grid>
    </div>
  );
};

export default Landing;
