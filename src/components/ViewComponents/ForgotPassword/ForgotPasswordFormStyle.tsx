import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  error: {
    color: 'red',
  },
  inputDiv: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));

interface FormStyleProps {
  email: string;
  error: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const ForgotPasswordFormStyle: React.FC<FormStyleProps> = ({
  email,
  error,
  onChange,
  onSubmit,
}) => {
  const classes = useStyles();

  const isInvalid = email === '';
  return (
    <form onSubmit={onSubmit} noValidate>
      <p>
        Please enter the email associated with your account. You will receive an
        email shortly.
      </p>
      <div className={classes.inputDiv}>
        <TextField
          name="email"
          label="Email Address"
          value={email}
          onChange={onChange}
          type="text"
          placeholder="Email Address"
        />
        <Button
          color="primary"
          variant="contained"
          disabled={isInvalid}
          type="submit"
        >
          Reset Password
        </Button>
      </div>
      <p className={classes.error}>{error}</p>
    </form>
  );
};

ForgotPasswordFormStyle.propTypes = {
  email: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ForgotPasswordFormStyle;
