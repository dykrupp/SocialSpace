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
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { Tooltip } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  chatsList: {
    overflowY: 'auto',
    minHeight: '264px',
    paddingTop: '0px',
    paddingBottom: '0px',
  },
  accountImage: {
    fontSize: '40px',
  },
  selectedItem: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
}));

interface ChatListProps {
  users: UserProfileUID[];
  onChatClick: (chatUID: string) => Promise<void>;
  currentChatUID: string;
}

export const ChatList: React.FC<ChatListProps> = ({
  users,
  onChatClick,
  currentChatUID,
}) => {
  const classes = useStyles();
  const [chatUIDS, setChatUIDS] = useState<ChatUID[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);

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

        currentChats.map((chat) => {
          chat.userUIDS = Object.keys(chat.userUIDS).map((key) => ({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(chat.userUIDS as any)[key],
            uid: key,
          }));
          return chat;
        });

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
          chat.userUIDS.filter((x) => x.uid === selectedUserUID).length !== 0 &&
          chat.userUIDS.filter((x) => x.uid === authUser.uid).length !== 0
      );

      if (!chatUID) {
        const dateTime = new Date().toUTCString();
        const pushedRef = firebase.chatUIDS().push().ref;

        await pushedRef.child(`userUIDS/${selectedUserUID}`).set({
          lastSeen: dateTime,
        });

        await pushedRef.child(`userUIDS/${authUser.uid}`).set({
          lastSeen: dateTime,
        });

        return pushedRef.key ? pushedRef.key : '';
      } else return chatUID.uid;
    }
    return '';
  };
  const removeMessages = (): void => {
    firebase?.messages(currentChatUID).remove();
  };

  return (
    <List className={classes.chatsList}>
      {users.map((user, index) => (
        <ListItem
          button
          key={user.uid}
          className={`${selectedIndex === index ? classes.selectedItem : ''}`}
          onClick={async (): Promise<void> => {
            setSelectedIndex(index);
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
          <Tooltip title="Delete Conversation">
            <IconButton color="primary" onClick={(): void => removeMessages()}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </ListItem>
      ))}
    </List>
  );
};

ChatList.propTypes = {
  users: PropTypes.array.isRequired,
  onChatClick: PropTypes.func.isRequired,
  currentChatUID: PropTypes.string.isRequired,
};
