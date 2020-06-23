import React, { useState, useEffect, useContext } from 'react';
import List from '@material-ui/core/List';
import { Avatar } from '@material-ui/core';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { UserProfileUID, ChatUID } from '../../../../../constants/interfaces';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { FirebaseContext } from '../../../../Firebase/context';
import { AuthUserContext } from '../../../../Authentication/AuthProvider/context';

const useStyles = makeStyles(() => ({
  chatsList: {
    height: '200px',
    overflowY: 'auto',
  },
  accountImage: {
    fontSize: '40px',
  },
}));

interface ChatListProps {
  users: UserProfileUID[];
  onChatClick: (chatUID: string) => Promise<void>;
}

export const ChatList: React.FC<ChatListProps> = ({ users, onChatClick }) => {
  const classes = useStyles();
  const [chatUIDS, setChatUIDS] = useState<ChatUID[]>([]);
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);

  useEffect(() => {
    if (firebase) {
      firebase.chatUIDS().on('value', (snapShot) => {
        const chatUIDObject = snapShot.val();
        if (!chatUIDObject) return;

        const currentChats: ChatUID[] = Object.keys(chatUIDObject).map(
          (key) => ({
            ...chatUIDObject[key],
            uid: key,
          })
        );

        setChatUIDS(currentChats);
      });
    }

    return function cleanup(): void {
      firebase?.chatUIDS().off();
    };
  }, [firebase]);

  const getChatUID = async (selectedUserUID: string): Promise<string> => {
    if (authUser && firebase) {
      const chatUID = chatUIDS.find(
        (chat) =>
          chat.userUIDS.includes(selectedUserUID) &&
          chat.userUIDS.includes(authUser.uid)
      );

      if (!chatUID) {
        const pushedUID = await firebase
          .chatUIDS()
          .push({
            userUIDS: [selectedUserUID, authUser.uid],
          })
          .then((snapShot) => snapShot.key);
        return pushedUID ? pushedUID : '';
      } else return chatUID.uid;
    }
    return '';
  };

  return (
    <List className={classes.chatsList}>
      {users.map((user) => (
        <ListItem
          button
          key={user.uid}
          onClick={async (): Promise<void> => {
            const selectedChatUID = await getChatUID(user.uid);
            onChatClick(selectedChatUID);
          }}
        >
          <ListItemAvatar>
            {user.profilePicURL !== '' ? (
              <Avatar alt="Profile Picture" src={user.profilePicURL} />
            ) : (
              <AccountCircle className={classes.accountImage} />
            )}
          </ListItemAvatar>
          <ListItemText primary={user.fullName} />
        </ListItem>
      ))}
    </List>
  );
};

ChatList.propTypes = {
  users: PropTypes.array.isRequired,
  onChatClick: PropTypes.func.isRequired,
};
