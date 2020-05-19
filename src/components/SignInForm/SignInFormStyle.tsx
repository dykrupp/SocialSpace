import React from 'react';
import PropTypes from 'prop-types';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

interface FormStyleProps {
  email: string;
  password: string;
  error: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    buttonBase: {
      verticalAlign: 'bottom',
    },
  })
);

const SignInFormStyle: React.FC<FormStyleProps> = ({
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
      <TextField
        required
        name="email"
        id="outlined-basic"
        label="Email Address"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <TextField
        name="password"
        id="outlined-password-input"
        label="Password"
        value={password}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <Button
        className={classes.buttonBase}
        variant="contained"
        color="secondary"
        disabled={isInvalid}
        type="submit"
      >
        Login
      </Button>
      <p>{error}</p>
    </form>
  );
};

SignInFormStyle.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SignInFormStyle;
