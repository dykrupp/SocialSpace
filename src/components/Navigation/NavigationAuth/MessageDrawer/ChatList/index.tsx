import React, { useState, useContext, useEffect } from 'react';
import List from '@material-ui/core/List';
import { Avatar } from '@material-ui/core';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {
  UserProfileUID,
  ChatUID,
} from '../../../../../utils/constants/interfaces';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { FirebaseContext } from '../../../../Firebase/context';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { Tooltip } from '@material-ui/core';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import { containsUnreadMessages } from '../../../../../utils/helperFunctions';
import Firebase from '../../../../Firebase';
import {
  AuthUser,
  AuthUserContext,
} from '../../../../Authentication/AuthProvider/context';

interface ChatListProps {
  users: UserProfileUID[];
  onChatClick: (chatUID: string) => Promise<void>;
  currentChatUID: string;
  chatUIDS: ChatUID[];
}

const useStyles = makeStyles(() => ({
  chatsList: {
    overflowY: 'auto',
    minHeight: '264px',
    maxHeight: '264px',
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

export const ChatList: React.FC<ChatListProps> = ({
  users,
  onChatClick,
  currentChatUID,
  chatUIDS,
}) => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <List className={classes.chatsList}>
      {users.map((user, index) => (
        <ChatListItem
          setSelectedIndex={setSelectedIndex}
          selectedIndex={selectedIndex}
          key={user.uid}
          user={user}
          index={index}
          onChatClick={onChatClick}
          currentChatUID={currentChatUID}
          chatUIDS={chatUIDS}
        />
      ))}
    </List>
  );
};

ChatList.propTypes = {
  users: PropTypes.array.isRequired,
  onChatClick: PropTypes.func.isRequired,
  currentChatUID: PropTypes.string.isRequired,
  chatUIDS: PropTypes.array.isRequired,
};

interface ChatListItemProps {
  user: UserProfileUID;
  onChatClick: (chatUID: string) => Promise<void>;
  setSelectedIndex: (index: number) => void;
  currentChatUID: string;
  chatUIDS: ChatUID[];
  index: number;
  selectedIndex?: number | null;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  user,
  index,
  onChatClick,
  currentChatUID,
  chatUIDS,
  selectedIndex,
  setSelectedIndex,
}) => {
  const classes = useStyles();
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  const getChatUID = (
    selectedUserUID: string,
    chatUIDS: ChatUID[],
    authUser: AuthUser
  ): ChatUID | null => {
    const chatUID = chatUIDS.find(
      (chat) =>
        chat.userUIDS.filter((x) => x.userUID === selectedUserUID).length !==
          0 &&
        chat.userUIDS.filter((x) => x.userUID === authUser?.uid).length !== 0
    );

    return chatUID ? chatUID : null;
  };

  const createChatUID = async (
    selectedUserUID: string,
    authUserUID: string,
    firebase: Firebase
  ): Promise<string> => {
    const dateTime = new Date().toUTCString();
    const pushedRef = firebase.chatUIDS().push().ref;

    await pushedRef.child(`userUIDS/${selectedUserUID}`).set({
      lastSeen: dateTime,
    });

    await pushedRef.child(`userUIDS/${authUserUID}`).set({
      lastSeen: dateTime,
    });

    return pushedRef.key ? pushedRef.key : '';
  };

  useEffect(() => {
    const chatUID = getChatUID(user.uid, chatUIDS, authUser);

    if (chatUID && authUser)
      setHasUnreadMessages(containsUnreadMessages(chatUID, authUser.uid));
  }, [chatUIDS, authUser, currentChatUID, user]);

  const removeMessages = (): void => {
    firebase?.messages(currentChatUID).remove();
  };

  if (!firebase || !authUser) return null;
  return (
    <ListItem
      button
      className={`${selectedIndex === index ? classes.selectedItem : ''}`}
      onClick={async (): Promise<void> => {
        setSelectedIndex(index);
        const maybeChatID = getChatUID(user.uid, chatUIDS, authUser);
        const selectedChatID = maybeChatID
          ? maybeChatID.uid
          : await createChatUID(user.uid, authUser?.uid, firebase);
        onChatClick(selectedChatID);
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
      {hasUnreadMessages && (
        <Tooltip title="New Message">
          <PriorityHighIcon color="secondary" />
        </Tooltip>
      )}
      <Tooltip title="Delete Conversation">
        <IconButton color="primary" onClick={(): void => removeMessages()}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </ListItem>
  );
};

ChatListItem.propTypes = {
  user: PropTypes.any.isRequired,
  onChatClick: PropTypes.func.isRequired,
  currentChatUID: PropTypes.string.isRequired,
  chatUIDS: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  selectedIndex: PropTypes.any,
  setSelectedIndex: PropTypes.func.isRequired,
};
