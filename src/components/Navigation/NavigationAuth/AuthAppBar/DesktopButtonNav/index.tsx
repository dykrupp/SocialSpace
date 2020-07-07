import React, { useContext, useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Tooltip } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import PropTypes from 'prop-types';
import { ChatUID, Notification } from '../../../../../constants/interfaces';
import { AuthUserContext } from '../../../../Authentication/AuthProvider/context';
import { containsUnreadMessages } from '../../../../../utils/helperFunctions';

interface DesktopButtonNavProps {
  setIsMessageDrawerOpen: (isOpen: React.SetStateAction<boolean>) => void;
  handleUserMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  setIsNotificationDrawerOpen: (isOpen: React.SetStateAction<boolean>) => void;
  notifications: Notification[];
  chatUIDS: ChatUID[];
}

export const DesktopButtonNav: React.FC<DesktopButtonNavProps> = ({
  setIsMessageDrawerOpen,
  handleUserMenuOpen,
  chatUIDS,
  setIsNotificationDrawerOpen,
  notifications,
}) => {
  const authUser = useContext(AuthUserContext);
  const [unreadMailCount, setUnreadMailCount] = useState(0);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  useEffect(() => {
    if (!authUser) return;
    setUnreadMailCount(() => {
      let count = 0;
      chatUIDS.forEach((chatUID) => {
        if (containsUnreadMessages(chatUID, authUser.uid)) count++;
      });
      return count;
    });
  }, [chatUIDS, authUser]);

  useEffect(() => {
    setUnreadNotificationCount(notifications.filter((x) => !x.read).length);
  }, [notifications]);

  return (
    <>
      <Tooltip title="Notifications">
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
          <Badge badgeContent={unreadMailCount} color="secondary">
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
};

DesktopButtonNav.propTypes = {
  setIsMessageDrawerOpen: PropTypes.func.isRequired,
  handleUserMenuOpen: PropTypes.func.isRequired,
  setIsNotificationDrawerOpen: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired,
  chatUIDS: PropTypes.array.isRequired,
};
