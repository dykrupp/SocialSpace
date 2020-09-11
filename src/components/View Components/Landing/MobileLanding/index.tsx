import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Button, Paper } from '@material-ui/core';
import * as ROUTES from '../../../../constants/routes';
import { Link } from 'react-router-dom';
import { SignInFormState } from '../../../../constants/interfaces';
import { FirebaseContext } from '../../../Firebase/context';
import { FIREBASE_NOT_ACCESSIBLE } from '../../../../constants/labels';
import { BlueOutlinedTextField } from '../../../Reusable Components/OutlinedTextField';
import { FirebaseError } from 'firebase';
import { useHistory } from 'react-router-dom';
import { CustomDivider } from '../../../Reusable Components/CustomDivider';

const useStyles = makeStyles(() => ({
  mobileLink: {
    textDecoration: 'none',
    outline: 0,
    color: 'black',
  },
  textField: {
    background: 'white',
    width: '250px',
  },
  gridItem: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    alignItems: 'center',
  },
  loginButton: {
    height: '50px',
    width: '200px',
  },
  errorGridItem: {
    height: '48px',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
  },
  createAccountButton: {
    height: '50px',
    width: '200px',
  },
  forgotPassGridItem: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '15px',
    marginBottom: '15px',
  },
  paper: {
    padding: '25px',
    margin: '25px auto',
  },
}));

const initialFormState: SignInFormState = {
  email: '',
  password: '',
  error: '',
};

export const MobileLanding: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [formState, setFormState] = useState<SignInFormState>(initialFormState);
  const firebase = useContext(FirebaseContext);

  const onLogin = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    const { email, password } = formState;

    if (firebase) {
      firebase.signIn(email, password).catch((error: FirebaseError) => {
        setFormState((previousState) => {
          return { ...previousState, error: error.message };
        });
      });
    }

    event.preventDefault();
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.persist(); //needed to be used within 'setState()'

    setFormState((previousState) => {
      return { ...previousState, [event.target.name]: event.target.value };
    });
  };

  const { email, password, error } = formState;
  const isLoginInvalid = formState.email === '' || formState.password === '';

  if (!firebase) return <h1>{FIREBASE_NOT_ACCESSIBLE}</h1>;
  return (
    <Paper elevation={3} className={classes.paper}>
      <Grid container direction="column">
        <Grid item className={classes.gridItem}>
          <BlueOutlinedTextField
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Email"
            type="text"
            variant="outlined"
            className={classes.textField}
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <BlueOutlinedTextField
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Password"
            variant="outlined"
            type="password"
            className={classes.textField}
          />
        </Grid>
        <Grid item className={classes.gridItem}>
          <Button
            className={classes.loginButton}
            color="primary"
            variant="contained"
            disabled={isLoginInvalid}
            onClick={(e): void => onLogin(e)}
          >
            Login
          </Button>
        </Grid>
        <Grid item className={classes.errorGridItem}>
          <p className={classes.errorText}>
            {error ? error.concat(' Please try again!') : ''}
          </p>
        </Grid>
        <Grid item className={classes.gridItem} style={{ marginTop: '-15px' }}>
          <CustomDivider dividerWidth="45%" />
          <p>or</p>
          <CustomDivider dividerWidth="45%" />
        </Grid>
        <Grid item className={classes.gridItem}>
          <Button
            className={classes.createAccountButton}
            color="primary"
            variant="contained"
            onClick={(): void => history.push(ROUTES.SIGNUP)}
          >
            Create Account
          </Button>
        </Grid>
        <Grid item className={classes.forgotPassGridItem}>
          <Link className={classes.mobileLink} to={ROUTES.FORGOT_PASSWORD}>
            Forgot Password?
          </Link>
        </Grid>
      </Grid>
    </Paper>
  );
};
