import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../customExports/routes';
import Navigation from '../Navigation';
import LandingPage from '../ViewComponents/Landing';
import ForgotPassword from '../ViewComponents/ForgotPassword';
import HomePage from '../ViewComponents/Home';
import AccountPage from '../ViewComponents/Account';
import AdminPage from '../ViewComponents/Admin';
import AuthProvider from '../AuthProvider';
import AuthProtectedRoute from '../AuthProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div id="App">
          <Navigation />
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPassword} />
          <AuthProtectedRoute exact path={ROUTES.HOME} component={HomePage} />
          <AuthProtectedRoute
            exact
            path={ROUTES.ACCOUNT}
            component={AccountPage}
          />
          <AuthProtectedRoute exact path={ROUTES.ADMIN} component={AdminPage} />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
