import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import SignUpPage from './SignUp';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    height: 'calc(100% - 82px)',
    minWidth: '1200px',
  },
  gridContainer: {
    height: '100%',
    width: '980px',
    margin: 'auto',
  },
}));

const Landing: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container className={classes.gridContainer}>
        <Grid item xs style={{ background: 'yellow', width: '500px' }}>
          Hello
        </Grid>
        <Grid item style={{ width: '460px' }}>
          <SignUpPage />
        </Grid>
      </Grid>
    </div>
  );
};

export default Landing;
