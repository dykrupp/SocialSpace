import React from 'react';
import * as ROUTES from '../../customExports/routes';
import { Link } from 'react-router-dom';

const SignUpLink: React.FC = () => (
  <p>
    Don&rsquo;t have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

export default SignUpLink;
