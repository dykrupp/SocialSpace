import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import Navigation from '../Navigation';
import LandingPage from '../ViewComponents/Landing';
import ForgotPasswordPage from '../ViewComponents/ForgotPassword';
import HomePage from '../ViewComponents/Home';
import AuthProvider from '../Authentication/AuthProvider';
import AuthProtectedRoute from '../Authentication/AuthProtectedRoute';
import SettingsPage from '../ViewComponents/Settings';
import { ProfilePage } from '../ViewComponents/Profile';
import { EditProfilePage } from '../ViewComponents/EditProfile';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div id="App">
          <Navigation />
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route
            exact
            path={ROUTES.FORGOT_PASSWORD}
            component={ForgotPasswordPage}
          />
          <AuthProtectedRoute exact path={ROUTES.HOME} component={HomePage} />
          <AuthProtectedRoute
            path={`${ROUTES.PROFILE}/:userUID`}
            component={ProfilePage}
          />
          <AuthProtectedRoute
            exact
            path={ROUTES.EDIT_PROFILE}
            component={EditProfilePage}
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
