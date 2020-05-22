import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../customExports/routes';
import Navigation from '../Navigation';
import LandingPage from '../ViewComponents/Landing';
import ForgotPasswordPage from '../ViewComponents/ForgotPassword';
import HomePage from '../ViewComponents/Home';
import AuthProvider from '../AuthProvider';
import AuthProtectedRoute from '../AuthProtectedRoute';
import SettingsPage from '../ViewComponents/Settings';
import ProfilePage from '../ViewComponents/Profile';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div id="App">
          <Navigation />
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordPage} />
          <AuthProtectedRoute exact path={ROUTES.HOME} component={HomePage} />
          <AuthProtectedRoute
            exact
            path={ROUTES.PROFILE}
            component={ProfilePage}
          />
          <AuthProtectedRoute
            exact
            path={ROUTES.SETTINGS}
            component={SettingsPage}
          />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
