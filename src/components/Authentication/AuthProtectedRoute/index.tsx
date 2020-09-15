import React, { useContext } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { AuthUserContext } from '../AuthProvider/context';
import * as ROUTES from '../../../utils/constants/routes';

const AuthProtectedRoute: React.FC<RouteProps> = (props) => {
  if (useContext(AuthUserContext)) return <Route {...props} />;
  else {
    return (
      <Route
        {...props}
        render={(): JSX.Element => <Redirect to={ROUTES.LANDING} />}
      />
    );
  }
};

export default AuthProtectedRoute;
