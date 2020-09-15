import React, { useContext } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import * as ROUTES from '../../../../constants/routes';
import { AuthUserContext } from '../../../Authentication/AuthProvider/context';
import { useHistory } from 'react-router-dom';
import { FirebaseContext } from '../../../Firebase/context';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

interface MobileMenuProps {
  mobileMenuAnchor: null | HTMLElement;
  handleMobileMenuClose: () => void;
  setIsNotificationDrawerOpen: (isOpen: React.SetStateAction<boolean>) => void;
  setIsMessageDrawerOpen: (isOpen: React.SetStateAction<boolean>) => void;
  unreadNotificationCount: number;
  unreadMessageCount: number;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  mobileMenuAnchor,
  handleMobileMenuClose,
  setIsNotificationDrawerOpen,
  setIsMessageDrawerOpen,
  unreadNotificationCount,
  unreadMessageCount,
}) => {
  const isMobileMenuOpen = Boolean(mobileMenuAnchor);
  const authUser = useContext(AuthUserContext);
  const history = useHistory();
  const firebase = useContext(FirebaseContext);

  return (
    <Menu
      anchorEl={mobileMenuAnchor}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem
        onClick={(): void => setIsNotificationDrawerOpen((isOpen) => !isOpen)}
      >
        <IconButton color="inherit">
          <Badge badgeContent={unreadNotificationCount} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem
        onClick={(): void => setIsMessageDrawerOpen((isOpen) => !isOpen)}
      >
        <IconButton color="inherit">
          <Badge badgeContent={unreadMessageCount} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem
        onClick={(): void => {
          history.push(`${ROUTES.PROFILE}/${authUser?.uid}`);
        }}
      >
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      {firebase && (
        <MenuItem
          onClick={(): void => {
            firebase.signOut();
          }}
        >
          <IconButton color="inherit">
            <ExitToAppIcon />
          </IconButton>
          Logout
        </MenuItem>
      )}
    </Menu>
  );
};

MobileMenu.propTypes = {
  mobileMenuAnchor: PropTypes.any,
  handleMobileMenuClose: PropTypes.func.isRequired,
  setIsMessageDrawerOpen: PropTypes.func.isRequired,
  setIsNotificationDrawerOpen: PropTypes.func.isRequired,
  unreadNotificationCount: PropTypes.number.isRequired,
  unreadMessageCount: PropTypes.number.isRequired,
};
