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
      display: 'flex',
      alignItems: 'center',
      '& > *': {
        margin: theme.spacing(1),
        width: '22ch',
      },
    },
    buttonBase: {
      verticalAlign: 'bottom',
    },
    textField: {
      marginTop: '-10px',
    },
    textAlign: {
      textAlign: 'center',
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
      <p className={classes.textAlign}>{error}</p>
      <TextField
        name="email"
        className={classes.textField}
        label="Email Address"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <TextField
        name="password"
        className={classes.textField}
        label="Password"
        value={password}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <Button
        className={classes.buttonBase}
        color="primary"
        variant="contained"
        disabled={isInvalid}
        type="submit"
      >
        Login
      </Button>
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
