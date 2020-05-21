import React from 'react';
import * as ROUTES from '../../../../customExports/routes';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    link: {
      color: 'white',
      opacity: '.8',
      outline: 0,
    },
  })
);

const ForgotPasswordLink: React.FC = () => {
  const classes = useStyles();
  return (
    <p>
      <Link className={classes.link} to={ROUTES.FORGOT_PASSWORD}>
        Forgot Password?
      </Link>
    </p>
  );
};

export default ForgotPasswordLink;
