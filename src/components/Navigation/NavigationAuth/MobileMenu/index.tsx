import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';

interface MobileMenuProps {
  mobileMenuAnchor: null | HTMLElement;
  handleMobileMenuClose: () => void;
  handleUserMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  mobileMenuAnchor,
  handleMobileMenuClose,
  handleUserMenuOpen,
}) => {
  const isMobileMenuOpen = Boolean(mobileMenuAnchor);
  return (
    <Menu
      anchorEl={mobileMenuAnchor}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleUserMenuOpen}>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
};

MobileMenu.propTypes = {
  mobileMenuAnchor: PropTypes.any,
  handleMobileMenuClose: PropTypes.func.isRequired,
  handleUserMenuOpen: PropTypes.func.isRequired,
};
