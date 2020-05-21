import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SignInForm from '../NavigationNonAuth/SignInForm';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../customExports/routes';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
    appBar: {
      height: '82px',
      justifyContent: 'space-evenly',
      flexDirection: 'row',
      minWidth: '1200px',
    },
    toolBar: {
      height: '82px',
      width: '80%',
    },
    link: {
      color: 'white',
      textDecoration: 'none',
      outline: 0,
    },
  })
);

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
          <SignInForm />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavigationNonAuth;
