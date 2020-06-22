import React, { useContext } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { FirebaseContext } from '../../../Firebase/context';
import { useHistory } from 'react-router-dom';
import * as ROUTES from '../../../../constants/routes';
import { AuthUserContext } from '../../../Authentication/AuthProvider/context';
import PropTypes from 'prop-types';

interface UserMenuProps {
  menuAnchor: null | HTMLElement;
  handleMenuClose: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  menuAnchor,
  handleMenuClose,
}) => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const history = useHistory();

  const isMenuOpen = Boolean(menuAnchor);
  return (
    <Menu
      anchorEl={menuAnchor}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {firebase && (
        <MenuItem
          onClick={(): void => {
            history.push(`${ROUTES.PROFILE}/${authUser?.uid}`);
            handleMenuClose();
          }}
        >
          Profile
        </MenuItem>
      )}
      {firebase && (
        <MenuItem
          onClick={(): void => {
            firebase.signOut();
            handleMenuClose();
          }}
        >
          Log Out
        </MenuItem>
      )}
    </Menu>
  );
};

UserMenu.propTypes = {
  menuAnchor: PropTypes.any,
  handleMenuClose: PropTypes.func.isRequired,
};
