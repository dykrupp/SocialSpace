import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SignInForm from '../NavigationNonAuth/SignInForm';

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
      justifyContent: 'center',
      flexDirection: 'row',
    },
    toolBar: {
      height: '82px',
      width: '75%',
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
            SocialSpace
          </Typography>
          <SignInForm />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavigationNonAuth;
