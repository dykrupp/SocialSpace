import React, { useContext, useEffect } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { AuthUserContext } from '../AuthProvider/context';
import * as ROUTES from '../../customExports/routes';
import { useHistory } from 'react-router';
import { FirebaseContext } from '../Firebase/context';

const AuthProtectedRoute: React.FC<RouteProps> = (props) => {
  const history = useHistory();
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    const listener = firebase?.auth.onAuthStateChanged((authUser) => {
      if (!authUser) history.replace(ROUTES.LANDING);
    });

    return function cleanup(): void {
      if (listener) listener();
    };
  }, [firebase, history]);

  if (useContext(AuthUserContext)) return <Route {...props} />;
  else {
    const renderComponent = (): JSX.Element => <Redirect to={ROUTES.LANDING} />;
    return <Route {...props} component={renderComponent} />;
  }
};

export default AuthProtectedRoute;
