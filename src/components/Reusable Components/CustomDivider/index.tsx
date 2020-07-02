import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    borderColor: 'rgba(0, 54, 189, 0.7)',
    width: '100%',
  },
});

export const CustomDivider = (): JSX.Element => {
  const classes = useStyles();
  return <hr className={classes.root} />;
};
