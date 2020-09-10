import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import SignUpPage from './SignUp';
import LandingInfo from './LandingInfo';
import { nonAuthHeaderHeight } from '../../Navigation/NavigationNonAuth';
import { useMobileComponents } from '../../../utils/hooks/useMobileComponents';
import { MobileLanding } from './MobileLanding';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    height: `calc(100% - ${nonAuthHeaderHeight})`,
  },
  gridContainer: {
    height: '100%',
    width: '100%',
    margin: 'auto',
    justifyContent: 'center',
  },
  signUpGridItem: {
    width: '460px',
  },
  landingInfoGridItem: {
    width: '540px',
  },
}));

const Landing: React.FC = () => {
  return useMobileComponents() ? <MobileLanding /> : <DesktopLanding />;
};

export default Landing;

const DesktopLanding: React.FC = () => {
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
