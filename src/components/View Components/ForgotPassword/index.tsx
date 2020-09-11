import React from 'react';
import ForgotPasswordFormContainer from './ForgotPasswordFormContainer';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CustomDivider } from '../../Reusable Components/CustomDivider';
import { Paper } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: '25px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '25px',
  },
  title: {
    textAlign: 'center',
  },
  paperContainer: {
    padding: '25px',
  },
}));

const ForgotPassword: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper elevation={3} className={classes.paperContainer}>
        <div>
          <Typography className={classes.title} variant="h4">
            Forgot Your Password?
          </Typography>
          <CustomDivider />
        </div>
        <ForgotPasswordFormContainer />
      </Paper>
    </div>
  );
};

export default ForgotPassword;
