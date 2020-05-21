import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

interface FormStyleProps {
  username: string;
  email: string;
  error: string;
  passwordOne: string;
  passwordTwo: string;
  birthday: string;
  gender: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const useStyles = makeStyles(() => ({
  flexRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
  },
  buttonBase: {
    marginTop: '25px',
    width: '45%',
    height: '50px',
  },
  textField: {
    background: 'white',
  },
  radioGroup: {
    flexDirection: 'row',
  },
}));

const SignUpFormStyle: React.FC<FormStyleProps> = ({
  username,
  email,
  error,
  passwordOne,
  passwordTwo,
  birthday,
  onChange,
  onSubmit,
  gender,
}) => {
  const classes = useStyles();

  const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === '' ||
    email === '' ||
    username === '' ||
    birthday === '' ||
    gender === '';

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className={classes.flexRow}>
        <TextField
          name="username"
          value={username}
          onChange={onChange}
          type="text"
          placeholder="Full Name"
          variant="outlined"
          className={classes.textField}
        />
        <TextField
          name="email"
          value={email}
          onChange={onChange}
          type="text"
          placeholder="Email"
          variant="outlined"
          className={classes.textField}
        />
      </div>
      <div className={classes.flexRow}>
        <TextField
          name="passwordOne"
          value={passwordOne}
          onChange={onChange}
          type="password"
          placeholder="Password"
          variant="outlined"
          className={classes.textField}
        />
        <TextField
          name="passwordTwo"
          value={passwordTwo}
          onChange={onChange}
          type="password"
          placeholder="Confirm Password"
          variant="outlined"
          className={classes.textField}
        />
      </div>
      <div className={classes.flexRow}>
        <TextField
          id="date"
          name="birthday"
          label="Birthday"
          type="date"
          value={birthday}
          onChange={onChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <div className={classes.flexRow}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            aria-label="gender"
            name="gender"
            value={gender}
            onChange={onChange}
            className={classes.radioGroup}
          >
            <FormControlLabel
              value="female"
              control={<Radio color="primary" />}
              label="Female"
            />
            <FormControlLabel
              value="male"
              control={<Radio color="primary" />}
              label="Male"
            />
            <FormControlLabel
              value="other"
              control={<Radio color="primary" />}
              label="Other"
            />
          </RadioGroup>
        </FormControl>
      </div>
      <Button
        className={classes.buttonBase}
        type="submit"
        disabled={isInvalid}
        color="primary"
        variant="contained"
      >
        Sign Up
      </Button>
      <p style={{ color: 'red' }}>{error}</p>
    </form>
  );
};

SignUpFormStyle.propTypes = {
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  passwordOne: PropTypes.string.isRequired,
  passwordTwo: PropTypes.string.isRequired,
  birthday: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  gender: PropTypes.string.isRequired,
};

export default SignUpFormStyle;
