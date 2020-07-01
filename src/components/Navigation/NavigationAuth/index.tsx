import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';
import { MessageDrawer } from './MessageDrawer';
import { AuthAppBar } from './AuthAppBar';
import { UserProfileUID, ChatUID } from '../../../constants/interfaces';
import PropTypes from 'prop-types';
import { FirebaseContext } from '../../Firebase/context';

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
  const [chatUIDS, setChatUIDS] = useState<ChatUID[]>([]);
  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [mobileAnchor, setMobileAnchor] = React.useState<null | HTMLElement>(
    null
  );

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

  return (
    <div className={classes.mainDiv}>
      <AuthAppBar
        chatUIDS={chatUIDS}
        users={users}
        setIsMessageDrawerOpen={setIsMessageDrawerOpen}
        handleMobileMenuOpen={handleMobileMenuOpen}
        handleUserMenuOpen={handleUserMenuOpen}
      />
      <MessageDrawer
        chatUIDS={chatUIDS}
        isDrawerOpen={isMessageDrawerOpen}
        setIsDrawerOpen={setIsMessageDrawerOpen}
        users={users}
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
