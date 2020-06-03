import React, { useContext } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { AuthUserContext } from '../AuthProvider/context';
import * as ROUTES from '../../../constants/routes';

const AuthProtectedRoute: React.FC<RouteProps> = (props) => {
  if (useContext(AuthUserContext)) return <Route {...props} />;
  else {
    const renderComponent = (): JSX.Element => <Redirect to={ROUTES.LANDING} />;
    return <Route {...props} component={renderComponent} />;
  }
};

export default AuthProtectedRoute;
