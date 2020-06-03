import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';
import Navigation from '../../Navigation';
import LandingPage from '../Landing';
import ForgotPasswordPage from '../ForgotPassword';
import HomePage from '../Home';
import AuthProvider from '../../Authentication/AuthProvider';
import AuthProtectedRoute from '../../Authentication/AuthProtectedRoute';
import SettingsPage from '../Settings';
import ProfilePage from '../Profile';

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
