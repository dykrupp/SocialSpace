import React from 'react';
import * as ROUTES from '../../customExports/routes';
import { Link } from 'react-router-dom';

const ForgotPasswordLink: React.FC = () => (
  <p>
    <Link to={ROUTES.FORGOT_PASSWORD}>Forgot Password?</Link>
  </p>
);

export default ForgotPasswordLink;
