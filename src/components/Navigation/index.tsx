import React, { useContext } from 'react';
import { AuthUserContext } from '../AuthProvider/context';
import NavigationNonAuth from './NavigationNonAuth';
import NavigationAuth from './NavigationAuth';

const Navigation: React.FC = () => (
  <div>
    {useContext(AuthUserContext) ? <NavigationAuth /> : <NavigationNonAuth />}
  </div>
);

export default Navigation;
