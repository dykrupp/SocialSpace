import React, { useContext } from 'react';
import { AuthUserContext } from '../Authentication/AuthProvider/context';
import NavigationNonAuth from './NavigationNonAuth';
import NavigationAuthContainer from './NavigationAuth';

const Navigation: React.FC = () => (
  <div>
    {useContext(AuthUserContext) ? (
      <NavigationAuthContainer />
    ) : (
      <NavigationNonAuth />
    )}
  </div>
);

export default Navigation;
