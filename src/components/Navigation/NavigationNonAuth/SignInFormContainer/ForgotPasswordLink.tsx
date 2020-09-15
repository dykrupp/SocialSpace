import React from 'react';
import * as ROUTES from '../../../../utils/constants/routes';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: '120px',
    },
    link: {
      color: 'white',
      opacity: '.8',
      outline: 0,
      textDecoration: 'none',
    },
  })
);

const ForgotPasswordLink: React.FC = () => {
  const classes = useStyles();
  return (
    <p className={classes.container}>
      <Link className={classes.link} to={ROUTES.FORGOT_PASSWORD}>
        Forgot Password?
      </Link>
    </p>
  );
};

export default ForgotPasswordLink;
