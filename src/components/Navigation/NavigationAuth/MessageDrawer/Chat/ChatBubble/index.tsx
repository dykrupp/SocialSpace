import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Message,
  UserProfileUID,
} from '../../../../../../constants/interfaces';
import { AuthUserContext } from '../../../../../Authentication/AuthProvider/context';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  getFirstName,
  calcTimeSince,
} from '../../../../../../utils/helperFunctions';
import { ListItem, ListItemText } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  bubbleContainer: {
    marginTop: '8px',
    marginBottom: '8px',
    display: 'flex',
    fontFamily: 'sans-serif',
    fontSize: '14px',
    alignItems: 'center',
    borderRadius: '5px',
  },
  bubble: {
    boxShadow: '0 0 6px #B2B2B2',
    display: 'block',
    padding: '10px 18px',
    position: 'relative',
    verticalAlign: 'top',
    color: 'white',
    overflowWrap: 'anywhere',
  },
  userChat: {
    backgroundColor: theme.palette.primary.main,
  },
  otherUserChat: {
    backgroundColor: '#8F5DB7',
  },
  userchatListItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  otherUserChatListItem: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  messageInfo: {
    marginBottom: '-5px',
  },
}));

interface ChatBubbleProps {
  message: Message;
  users: UserProfileUID[];
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, users }) => {
  const authUser = useContext(AuthUserContext);
  const isCurrentUser = authUser?.uid === message.userUID;
  const classes = useStyles();

  const getName = (userUID: string): string => {
    const user = users.find((x) => x.uid === userUID);
    return user ? getFirstName(user.fullName) : '';
  };

  return (
    <ListItem
      className={
        isCurrentUser ? classes.userchatListItem : classes.otherUserChatListItem
      }
    >
      <ListItemText
        className={classes.messageInfo}
        primary={getName(message.userUID)}
        secondary={calcTimeSince(Date.parse(message.dateTime))}
      />
      <div
        className={`${classes.bubbleContainer} ${
          isCurrentUser ? classes.userChat : classes.otherUserChat
        }`}
      >
        <div className={classes.bubble}>{message.text}</div>
      </div>
    </ListItem>
  );
};

ChatBubble.propTypes = {
  message: PropTypes.any.isRequired,
  users: PropTypes.array.isRequired,
};
