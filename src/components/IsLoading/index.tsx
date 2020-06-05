import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    justifyContent: 'center',
  },
  textAlign: {
    textAlign: 'center',
  },
}));

export const IsLoading = (): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h1 className={classes.textAlign}>Loading Please Wait</h1>
    </div>
  );
};
