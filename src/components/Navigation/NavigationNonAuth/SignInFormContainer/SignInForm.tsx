import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ForgotPasswordLink from './ForgotPasswordLink';

interface SignInFormProps {
  email: string;
  password: string;
  error: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  buttonBase: {
    width: '175px',
  },
  textField: {
    marginTop: '-10px',
    color: 'white',
  },
  textAlign: {
    textAlign: 'center',
    color: 'red',
  },
  input: {
    color: 'white',
  },
}));

const SignInForm: React.FC<SignInFormProps> = ({
  email,
  password,
  error,
  onChange,
  onSubmit,
}) => {
  const classes = useStyles();
  const isInvalid = password === '' || email === '';

  return (
    <form className={classes.root} onSubmit={onSubmit} noValidate>
      <p className={classes.textAlign}>
        {error ? error.concat(' Please try again!') : ''}
      </p>
      <TextField
        name="email"
        className={classes.textField}
        label="Email Address"
        value={email}
        onChange={onChange}
        type="text"
        InputProps={{
          className: classes.input,
        }}
        InputLabelProps={{
          className: classes.input,
        }}
        placeholder="Email Address"
      />
      <TextField
        name="password"
        className={classes.textField}
        label="Password"
        value={password}
        onChange={onChange}
        InputProps={{
          className: classes.input,
        }}
        InputLabelProps={{
          className: classes.input,
        }}
        type="password"
        placeholder="Password"
      />
      <Button
        className={classes.buttonBase}
        color="secondary"
        variant="contained"
        disabled={isInvalid}
        type="submit"
      >
        Login
      </Button>
      <ForgotPasswordLink />
    </form>
  );
};

SignInForm.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SignInForm;
