import React from 'react';
import SignUpForm from './SignUpForm';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: '25px',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontWeight: 'bold',
  },
}));

const SignUpPage: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="h4">
        Create an Account
      </Typography>
      <Typography variant="h6">It&apos;s quick and easy.</Typography>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
