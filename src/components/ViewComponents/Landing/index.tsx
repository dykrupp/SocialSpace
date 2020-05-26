import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import SignUpPage from './SignUp';
import LandingInfo from './LandingInfo';
import { AuthUserContext } from '../../AuthProvider/context';
import { Redirect } from 'react-router-dom';
import * as ROUTES from '../../../customExports/routes';

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

  if (useContext(AuthUserContext)) return <Redirect to={ROUTES.HOME} />;
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
