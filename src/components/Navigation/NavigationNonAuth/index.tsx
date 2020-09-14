import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SignInFormContainer from './SignInFormContainer';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';
import { makeStyles } from '@material-ui/core';

export const nonAuthHeaderHeight = '82px';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    height: nonAuthHeaderHeight,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  toolBar: {
    height: nonAuthHeaderHeight,
    width: '95%',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    outline: 0,
  },
}));

const NavigationNonAuth: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <Typography variant="h6" className={classes.title}>
            <Link
              className={classes.link}
              title="Go to SocialSpace Landing Page"
              to={ROUTES.LANDING}
            >
              SocialSpace
            </Link>
          </Typography>
          <SignInFormContainer />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavigationNonAuth;
