import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

export const BlueOutlinedTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      border: '2px solid rgba(0, 54, 189, 0.6)',
    },
    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      border: '3px solid rgba(0, 54, 189, 0.9)',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: '3px solid rgba(0, 54, 189, 0.9)',
    },
  },
})(TextField);

interface OutlinedTextFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const OutlinedTextField: React.FC<OutlinedTextFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeHandler,
}) => (
  <BlueOutlinedTextField
    fullWidth
    label={label}
    placeholder={placeholder}
    multiline
    variant="outlined"
    onChange={onChangeHandler}
    value={value}
  />
);

OutlinedTextField.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
};
