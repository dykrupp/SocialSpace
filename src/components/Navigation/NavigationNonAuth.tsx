import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SignInForm from '../SignInForm';

//TODO -> Make use of 'import { useMediaQuery } from 'react-responsive' to swap out signInForm to a button when screen width decreases
//OR make the inputs resize width on size change

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
  })
);

const NavigationNonAuth: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
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
