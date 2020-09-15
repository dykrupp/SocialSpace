import React, { useContext } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Tooltip } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import PropTypes from 'prop-types';
import { AuthUserContext } from '../../../../Authentication/AuthProvider/context';
import * as ROUTES from '../../../../../constants/routes';
import { useHistory } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { FirebaseContext } from '../../../../Firebase/context';

interface DesktopButtonNavProps {
  setIsMessageDrawerOpen: (isOpen: React.SetStateAction<boolean>) => void;
  setIsNotificationDrawerOpen: (isOpen: React.SetStateAction<boolean>) => void;
  unreadNotificationCount: number;
  unreadMessageCount: number;
}

export const DesktopButtonNav: React.FC<DesktopButtonNavProps> = ({
  setIsMessageDrawerOpen,
  unreadNotificationCount,
  setIsNotificationDrawerOpen,
  unreadMessageCount,
}) => {
  const history = useHistory();
  const authUser = useContext(AuthUserContext);
  const firebase = useContext(FirebaseContext);

  return (
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
      <Tooltip title="Profile">
        <IconButton
          color="inherit"
          onClick={(): void => {
            history.push(`${ROUTES.PROFILE}/${authUser?.uid}`);
          }}
        >
          <AccountCircle />
        </IconButton>
      </Tooltip>
      <Tooltip title="Logout">
        <IconButton
          color="inherit"
          onClick={(): Promise<void> | undefined => firebase?.signOut()}
        >
          <ExitToAppIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

DesktopButtonNav.propTypes = {
  setIsMessageDrawerOpen: PropTypes.func.isRequired,
  setIsNotificationDrawerOpen: PropTypes.func.isRequired,
  unreadMessageCount: PropTypes.number.isRequired,
  unreadNotificationCount: PropTypes.number.isRequired,
};
