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
  setIsNotificationDrawerOpen: (isOpen: React.SetStateAction<boolean>) => void;
  unreadNotificationCount: number;
  unreadMessageCount: number;
}

export const DesktopButtonNav: React.FC<DesktopButtonNavProps> = ({
  setIsMessageDrawerOpen,
  handleUserMenuOpen,
  unreadNotificationCount,
  setIsNotificationDrawerOpen,
  unreadMessageCount,
}) => (
  <>
    <Tooltip title="Toggle Notifications">
      <IconButton
        color="inherit"
        onClick={(): void => setIsNotificationDrawerOpen((isOpen) => !isOpen)}
      >
        <Badge badgeContent={unreadNotificationCount} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </Tooltip>
    <Tooltip title="Toggle Messages">
      <IconButton
        color="inherit"
        onClick={(): void => setIsMessageDrawerOpen((isOpen) => !isOpen)}
      >
        <Badge badgeContent={unreadMessageCount} color="secondary">
          <MailIcon />
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

DesktopButtonNav.propTypes = {
  setIsMessageDrawerOpen: PropTypes.func.isRequired,
  handleUserMenuOpen: PropTypes.func.isRequired,
  setIsNotificationDrawerOpen: PropTypes.func.isRequired,
  unreadMessageCount: PropTypes.number.isRequired,
  unreadNotificationCount: PropTypes.number.isRequired,
};
