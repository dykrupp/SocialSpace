import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../customExports/routes';
import SignOut from '../SignOut';
import { AuthUserContext } from '../AuthProvider/context';

const Navigation: React.FC = () => (
  <div>
    {useContext(AuthUserContext) ? <NavigationAuth /> : <NavigationNonAuth />}
  </div>
);

const NavigationAuth: React.FC = () => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.HOME}>Home</Link>
    </li>
    <li>
      <Link to={ROUTES.ACCOUNT}>Account</Link>
    </li>
    <li>
      <Link to={ROUTES.ADMIN}>Admin</Link>
    </li>
    <li>
      <SignOut />
    </li>
  </ul>
);

const NavigationNonAuth: React.FC = () => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </li>
  </ul>
);

export default Navigation;
