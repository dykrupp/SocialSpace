import React, { Ref } from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

export const BlueOutlinedTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      border: '2px solid rgba(0, 54, 189, 0.6)',
    },
    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      border: '2.2px solid rgba(0, 54, 189, 0.9)',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: '2.5px solid rgba(0, 54, 189, 0.9)',
    },
  },
})(TextField);

const useStyles = makeStyles(() => ({
  input: {
    maxHeight: '55px',
  },
}));

interface OutlinedTextFieldProps {
  label: string;
  placeholder: string;
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputRef?: Ref<any>;
  onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const OutlinedTextField: React.FC<OutlinedTextFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeHandler,
  inputRef,
}) => {
  const classes = useStyles();

  return (
    <BlueOutlinedTextField
      inputRef={inputRef}
      fullWidth
      label={label}
      placeholder={placeholder}
      multiline
      variant="outlined"
      onChange={onChangeHandler}
      value={value}
      InputProps={{ classes: { input: classes.input } }}
    />
  );
};

OutlinedTextField.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  inputRef: PropTypes.any,
};
