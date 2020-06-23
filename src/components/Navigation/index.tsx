import React, { useContext } from 'react';
import { AuthUserContext } from '../Authentication/AuthProvider/context';
import NavigationNonAuth from './NavigationNonAuth';
import { NavigationAuthContainer } from './NavigationAuth';
import { UserProfileUID } from '../../constants/interfaces';
import PropTypes from 'prop-types';

interface NavigationProps {
  users: UserProfileUID[];
}

const Navigation: React.FC<NavigationProps> = ({ users }) => (
  <div>
    {useContext(AuthUserContext) ? (
      <NavigationAuthContainer users={users} />
    ) : (
      <NavigationNonAuth />
    )}
  </div>
);

Navigation.propTypes = {
  users: PropTypes.array.isRequired,
};

export default Navigation;
