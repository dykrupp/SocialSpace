import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { OutlinedTextField } from '../../Reusable Components/OutlinedTextField/index';

const useStyles = makeStyles(() => ({
  error: {
    color: 'red',
  },
  inputDiv: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  resetPassButton: {
    marginTop: '20px',
  },
}));

interface ForgotPasswordFormProps {
  email: string;
  error: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
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
        <OutlinedTextField
          label="Email Address"
          value={email}
          onChangeHandler={onChange}
          placeholder="Email Address"
        />
        <Button
          color="primary"
          variant="contained"
          className={classes.resetPassButton}
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

ForgotPasswordForm.propTypes = {
  email: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ForgotPasswordForm;
