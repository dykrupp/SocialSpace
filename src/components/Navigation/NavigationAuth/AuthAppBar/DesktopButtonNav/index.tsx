import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Tooltip } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import PropTypes from 'prop-types';

interface DesktopButtonNavProps {
  setIsMessageDrawerOpen: (isOpen: React.SetStateAction<boolean>) => void;
  handleUserMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
}

export const DesktopButtonNav: React.FC<DesktopButtonNavProps> = ({
  setIsMessageDrawerOpen,
  handleUserMenuOpen,
}) => {
  return (
    <>
      <Tooltip title="Messages">
        <IconButton
          color="inherit"
          onClick={(): void => setIsMessageDrawerOpen((isOpen) => !isOpen)}
        >
          <Badge color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Tooltip title="Notifications">
        <IconButton color="inherit">
          <Badge badgeContent={17} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Tooltip title="User">
        <IconButton edge="end" onClick={handleUserMenuOpen} color="inherit">
          <AccountCircle />
        </IconButton>
      </Tooltip>
    </>
  );
};

DesktopButtonNav.propTypes = {
  setIsMessageDrawerOpen: PropTypes.func.isRequired,
  handleUserMenuOpen: PropTypes.func.isRequired,
};
