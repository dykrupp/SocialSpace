import React from 'react';
import SignUpFormContainer from './SignUpFormContainer';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useMobileComponents } from '../../../../utils/hooks/useMobileComponents';
import { CustomDivider } from '../../../Reusable Components/CustomDivider/index';
import PropTypes from 'prop-types';
import { Paper } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: '25px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '25px',
  },
  alignedText: {
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paper: {
    padding: '5px',
  },
}));

const SignUpPage: React.FC = () => {
  const classes = useStyles();
  return useMobileComponents() ? (
    <MobileForm classes={classes} />
  ) : (
    <Form classes={classes} />
  );
};

export default SignUpPage;

interface FormProps {
  classes: Record<string, string>;
}

const MobileForm: React.FC<FormProps> = ({ classes }) => (
  <div className={classes.root}>
    <Paper elevation={3} className={classes.paper}>
      <div>
        <Typography className={classes.alignedText} variant="h4">
          Create an Account
        </Typography>
        <CustomDivider />
      </div>
      <SignUpFormContainer />
    </Paper>
  </div>
);

MobileForm.propTypes = {
  classes: PropTypes.any.isRequired,
};

const Form: React.FC<FormProps> = ({ classes }) => (
  <div className={classes.root}>
    <div>
      <Typography className={classes.title} variant="h4">
        Create an Account
      </Typography>
      <Typography variant="h6" className={classes.alignedText}>
        It&apos;s quick and easy.
      </Typography>
    </div>
    <SignUpFormContainer />
  </div>
);

Form.propTypes = {
  classes: PropTypes.any.isRequired,
};
