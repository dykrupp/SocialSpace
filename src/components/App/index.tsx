import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../customExports/routes';
import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import ForgotPasswordPage from '../ForgotPassword';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import AuthProvider from '../AuthProvider';
import AuthProtectedRoute from '../AuthProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navigation />
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          {/* <Route path={ROUTES.SIGN_IN} component={SignInPage} /> */}
          <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordPage} />
          <AuthProtectedRoute exact path={ROUTES.HOME} component={HomePage} />
          <AuthProtectedRoute
            exact
            path={ROUTES.ACCOUNT}
            component={AccountPage}
          />
          <AuthProtectedRoute exact path={ROUTES.ADMIN} component={AdminPage} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
