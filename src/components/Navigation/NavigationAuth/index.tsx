import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { MobileMenu } from './MobileMenu';
import { MessageDrawer } from './MessageDrawer';
import { AuthAppBar } from './AuthAppBar';
import PropTypes from 'prop-types';
import { FirebaseContext } from '../../Firebase/context';
import { AuthUserContext } from '../../Authentication/AuthProvider/context';
import { NotificationDrawer } from './NotificationDrawer/index';
import { containsUnreadMessages } from '../../../utils/helperFunctions';
import {
  UserProfileUID,
  ChatUID,
  Notification,
} from '../../../constants/interfaces';

export const headerHeight = '48px';

const useStyles = makeStyles(() => ({
  mainDiv: {
    flexGrow: 1,
    display: 'flex',
    minHeight: headerHeight,
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
  const [mobileAnchor, setMobileAnchor] = useState<null | HTMLElement>(null);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(
    false
  );

  const handleMobileMenuClose = (): void => {
    setMobileAnchor(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setMobileAnchor(event.currentTarget);
  };

  useEffect(() => {
    if (!authUser) return;
    setUnreadMessageCount(() => {
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

        if (!notificationObject) {
          setNotifications([]);
          return;
        }

        const currentNotifications: Notification[] = Object.keys(
          notificationObject
        ).map((key) => ({
          ...notificationObject[key],
          notificationUID: key,
        }));

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
        unreadMessageCount={unreadMessageCount}
        users={users}
        setIsMessageDrawerOpen={setIsMessageDrawerOpen}
        handleMobileMenuOpen={handleMobileMenuOpen}
        unreadNotificationCount={unreadNotificationCount}
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
        users={users}
      />
      <MobileMenu
        unreadMessageCount={unreadMessageCount}
        mobileMenuAnchor={mobileAnchor}
        handleMobileMenuClose={handleMobileMenuClose}
        unreadNotificationCount={unreadNotificationCount}
        setIsNotificationDrawerOpen={setIsNotificationDrawerOpen}
        setIsMessageDrawerOpen={setIsMessageDrawerOpen}
      />
    </div>
  );
};

NavigationAuthContainer.propTypes = {
  users: PropTypes.array.isRequired,
};
