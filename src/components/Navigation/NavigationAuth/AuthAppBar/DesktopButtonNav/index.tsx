import React, { useContext, useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Tooltip } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import PropTypes from 'prop-types';
import { ChatUID } from '../../../../../constants/interfaces';
import { AuthUserContext } from '../../../../Authentication/AuthProvider/context';
import { containsUnreadMessages } from '../../../../../utils/helperFunctions';

interface DesktopButtonNavProps {
  setIsMessageDrawerOpen: (isOpen: React.SetStateAction<boolean>) => void;
  handleUserMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  chatUIDS: ChatUID[];
}

export const DesktopButtonNav: React.FC<DesktopButtonNavProps> = ({
  setIsMessageDrawerOpen,
  handleUserMenuOpen,
  chatUIDS,
}) => {
  const authUser = useContext(AuthUserContext);
  const [unreadMailCount, setUnreadMailCount] = useState(0);

  useEffect(() => {
    setUnreadMailCount(() => {
      if (!authUser) return 0;
      else {
        let count = 0;
        chatUIDS.forEach((chatUID) => {
          if (containsUnreadMessages(chatUID, authUser.uid)) count++;
        });
        return count;
      }
    });
  }, [chatUIDS, authUser]);

  return (
    <>
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
  chatUIDS: PropTypes.array.isRequired,
};
