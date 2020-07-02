import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import Navigation from '../Navigation';
import { Home } from '../View Components/Home';
import AuthProvider from '../Authentication/AuthProvider';
import AuthProtectedRoute from '../Authentication/AuthProtectedRoute';
import { Profile } from '../View Components/Profile';
import { EditProfile } from '../View Components/EditProfile';
import { UserProfileUID } from '../../constants/interfaces';
import { FirebaseContext } from '../Firebase/context';
import { AuthUserContext } from '../Authentication/AuthProvider/context';
import { convertToUserProfile } from '../../utils/helperFunctions';
import Landing from '../View Components/Landing';
import ForgotPassword from '../View Components/ForgotPassword';
import Settings from '../View Components/Settings';

const App: React.FC = () => {
  const [users, setUsers] = useState<UserProfileUID[]>([]);
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);

  useEffect(() => {
    const listener = firebase?.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        firebase?.users().on('value', (snapshot) => {
          const usersObject = snapshot.val();

          const usersList: UserProfileUID[] = Object.keys(
            usersObject
          ).map((key) => convertToUserProfile(usersObject[key], key));

          setUsers(() => {
            return usersList.sort((a, b) =>
              a.fullName.localeCompare(b.fullName)
            );
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
            render={(): JSX.Element => <EditProfile />}
          />
          <AuthProtectedRoute
            exact
            path={ROUTES.SETTINGS}
            render={(): JSX.Element => <Settings />}
          />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
