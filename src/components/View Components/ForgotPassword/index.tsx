import React from 'react';
import ForgotPasswordFormContainer from './ForgotPasswordFormContainer';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: '25px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
}));

const ForgotPassword: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="h4">
        Forgot Your Password?
      </Typography>
      <ForgotPasswordFormContainer />
    </div>
  );
};

export default ForgotPassword;
