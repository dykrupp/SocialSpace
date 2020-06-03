import React, { useContext } from 'react';
import { AuthUserContext } from '../Authentication/AuthProvider/context';
import NavigationNonAuth from './NavigationNonAuth';
import NavigationAuth from './NavigationAuth';

const Navigation: React.FC = () => (
  <div>
    {useContext(AuthUserContext) ? <NavigationAuth /> : <NavigationNonAuth />}
  </div>
);

export default Navigation;
