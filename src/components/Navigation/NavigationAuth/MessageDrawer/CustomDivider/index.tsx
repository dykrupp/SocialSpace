import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

const BlueDivider = withStyles({
  root: {
    backgroundColor: 'rgba(0, 54, 189, 0.7)',
  },
})(Divider);

export const CustomDivider = (): JSX.Element => <BlueDivider />;
