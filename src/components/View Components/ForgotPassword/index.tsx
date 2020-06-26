import React from 'react';
import ForgotPasswordForm from './ForgotPasswordForm';
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
  hr: {
    width: '500px',
  },
}));

const ForgotPassword: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="h4">
        Forgot Your Password?
      </Typography>
      <hr className={classes.hr} />
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;
