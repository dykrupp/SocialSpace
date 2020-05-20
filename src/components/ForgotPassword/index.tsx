import React from 'react';
import ForgotPasswordForm from './ForgotPasswordForm';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      marginTop: '25px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
    },
  })
);

const ForgotPasswordPage: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="h4">
        Forgot Your Password?
      </Typography>
      <hr style={{ width: '500px' }} />
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;
