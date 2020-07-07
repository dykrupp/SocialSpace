import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';
import { MessageDrawer } from './MessageDrawer';
import { AuthAppBar } from './AuthAppBar';
import {
  UserProfileUID,
  ChatUID,
  Notification,
} from '../../../constants/interfaces';
import PropTypes from 'prop-types';
import { FirebaseContext } from '../../Firebase/context';
import { AuthUserContext } from '../../Authentication/AuthProvider/context';
import { NotificationDrawer } from './NotificationDrawer/index';

const useStyles = makeStyles(() => ({
  mainDiv: {
    flexGrow: 1,
    minWidth: '760px',
  },
}));

interface NavigationAuthProps {
  users: UserProfileUID[];
}

export const NavigationAuthContainer: React.FC<NavigationAuthProps> = ({
  users,
}) => {
  const classes = useStyles();
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatUIDS, setChatUIDS] = useState<ChatUID[]>([]);
  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(
    false
  );
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileAnchor, setMobileAnchor] = useState<null | HTMLElement>(null);

  const handleMobileMenuClose = (): void => {
    setMobileAnchor(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setMobileAnchor(event.currentTarget);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = (): void => {
    setMenuAnchor(null);
    handleMobileMenuClose();
  };

  useEffect(() => {
    if (firebase) {
      firebase.chatUIDS().on('value', (snapShot) => {
        const chatUidObject = snapShot.val();
        if (!chatUidObject) return;

        const currentChats: ChatUID[] = Object.keys(chatUidObject).map(
          (key) => ({
            ...chatUidObject[key],
            uid: key,
          })
        );

        currentChats.forEach((chat) => {
          chat.userUIDS = Object.keys(chat.userUIDS).map((key) => ({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(chat.userUIDS as any)[key],
            userUID: key,
          }));
        });

        setChatUIDS(currentChats);
      });
    }
    return function cleanup(): void {
      firebase?.chatUIDS().off();
    };
  }, [firebase]);

  useEffect(() => {
    if (firebase && authUser) {
      firebase.notifications(authUser.uid).on('value', (snapShot) => {
        const notificationObject = snapShot.val();

        if (!notificationObject) return;

        const currentNotifications: Notification[] = Object.keys(
          notificationObject
        ).map((key) => ({
          ...notificationObject[key],
        }));

        if (currentNotifications.length > 0)
          setNotifications(currentNotifications);
      });
    }

    return function cleanup(): void {
      if (authUser) firebase?.notifications(authUser.uid);
    };
  }, [firebase, authUser]);

  return (
    <div className={classes.mainDiv}>
      <AuthAppBar
        chatUIDS={chatUIDS}
        users={users}
        setIsMessageDrawerOpen={setIsMessageDrawerOpen}
        handleMobileMenuOpen={handleMobileMenuOpen}
        handleUserMenuOpen={handleUserMenuOpen}
        notifications={notifications}
        setIsNotificationDrawerOpen={setIsNotificationDrawerOpen}
      />
      <MessageDrawer
        chatUIDS={chatUIDS}
        isDrawerOpen={isMessageDrawerOpen}
        setIsDrawerOpen={setIsMessageDrawerOpen}
        users={users}
      />
      <NotificationDrawer
        isDrawerOpen={isNotificationDrawerOpen}
        notifications={notifications}
        setIsDrawerOpen={setIsNotificationDrawerOpen}
      />
      <MobileMenu
        mobileMenuAnchor={mobileAnchor}
        handleUserMenuOpen={handleUserMenuOpen}
        handleMobileMenuClose={handleMobileMenuClose}
      />
      <UserMenu menuAnchor={menuAnchor} handleMenuClose={handleUserMenuClose} />
    </div>
  );
};

NavigationAuthContainer.propTypes = {
  users: PropTypes.array.isRequired,
};
