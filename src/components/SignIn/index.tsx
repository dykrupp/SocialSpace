import React from 'react';
import SignUpLink from '../SignUp/SignUpLink';
import SignInForm from './SignInForm';
import ForgotPasswordLink from '../ForgotPassword/ForgotPasswordLink';

const SignInPage: React.FC = () => (
  <div>
    <h1>Sign In Page</h1>
    <SignInForm />
    <ForgotPasswordLink />
    <SignUpLink />
  </div>
);

export default SignInPage;
