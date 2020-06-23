import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import Navigation from '../Navigation';
import { Home } from '../ViewComponents/Home';
import AuthProvider from '../Authentication/AuthProvider';
import AuthProtectedRoute from '../Authentication/AuthProtectedRoute';
import { Profile } from '../ViewComponents/Profile';
import { EditProfile } from '../ViewComponents/EditProfile';
import { UserProfileUID } from '../../constants/interfaces';
import { FirebaseContext } from '../Firebase/context';
import { AuthUserContext } from '../Authentication/AuthProvider/context';
import { convertToUserProfile } from '../../utils/helperFunctions';
import Landing from '../ViewComponents/Landing';
import ForgotPassword from '../ViewComponents/ForgotPassword';
import Settings from '../ViewComponents/Settings';

const App: React.FC = () => {
  const [users, setUsers] = useState<UserProfileUID[]>([]);
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);

  useEffect(() => {
    const listener = firebase?.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        firebase?.users().on('value', (snapshot) => {
          const usersObject = snapshot.val();

          const usersList = Object.keys(usersObject).map((key) =>
            convertToUserProfile(usersObject[key], key)
          );

          setUsers(() => {
            return usersList;
          });
        });
      }
    });

    return function cleanup(): void {
      if (listener) listener();
      firebase?.users().off();
    };
  }, [firebase, authUser]);

  return (
    <Router>
      <AuthProvider>
        <div id="App">
          <Navigation users={users} />
          <Route exact path={ROUTES.LANDING} component={Landing} />
          <Route
            exact
            path={ROUTES.FORGOT_PASSWORD}
            component={ForgotPassword}
          />
          <AuthProtectedRoute
            exact
            path={ROUTES.HOME}
            render={(): JSX.Element => <Home users={users} />}
          />
          <AuthProtectedRoute
            path={`${ROUTES.PROFILE}/:userUID`}
            render={(): JSX.Element => <Profile users={users} />}
          />
          <AuthProtectedRoute
            exact
            path={ROUTES.EDIT_PROFILE}
            component={EditProfile}
          />
          <AuthProtectedRoute
            exact
            path={ROUTES.SETTINGS}
            component={Settings}
          />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
