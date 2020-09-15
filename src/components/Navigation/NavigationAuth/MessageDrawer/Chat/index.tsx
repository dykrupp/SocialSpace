import React, { useState, useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Message,
  UserProfileUID,
} from '../../../../../utils/constants/interfaces';
import { FirebaseContext } from '../../../../Firebase/context';
import { AuthUserContext } from '../../../../Authentication/AuthProvider/context';
import { makeStyles } from '@material-ui/core/styles';
import { List, Typography } from '@material-ui/core';
import { ChatBubble } from './ChatBubble';
import { OutlinedTextField } from '../../../../Reusable Components/OutlinedTextField';
import { CustomDivider } from '../../../../Reusable Components/CustomDivider';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const inputHeight = '100px';

const useStyles = makeStyles(() => ({
  inputChatDiv: {
    height: inputHeight,
    alignItems: 'center',
    margin: '10px 20px 10px 20px',
    display: 'flex',
  },
  chatDiv: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    maxHeight: 'calc(100% - 330px)',
  },
  chat: {
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    minHeight: '120px',
    maxHeight: `calc(100% - ${inputHeight})`,
  },
  sendMessage: {
    marginTop: '10px',
    width: '250px',
  },
  textAlign: {
    textAlign: 'center',
  },
}));

interface ChatProps {
  chatUID: string;
  users: UserProfileUID[];
}

export const Chat: React.FC<ChatProps> = ({ chatUID, users }) => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatText, setChatText] = useState<string>('');
  const classes = useStyles();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (): void => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const setLastSeen = (): void => {
      if (firebase && authUser && chatUID !== '') {
        firebase
          .lastSeenChat(chatUID, authUser.uid)
          .set(new Date().toUTCString());
      }
    };

    scrollToBottom();
    setLastSeen();
  }, [messages, chatUID, authUser, firebase]);

  useEffect(() => {
    if (chatUID !== '') {
      firebase?.messages(chatUID).on('value', (snapShot) => {
        const messagesObject = snapShot.val();

        if (!messagesObject) {
          setMessages([]);
          return;
        }

        const currentMessages: Message[] = Object.keys(messagesObject).map(
          (key) => ({
            ...messagesObject[key],
          })
        );

        setMessages(() => currentMessages);
      });
    }

    return function cleanup(): void {
      firebase?.messages(chatUID).off();
    };
  }, [firebase, chatUID]);

  const sendMessage = (text: string): void => {
    firebase
      ?.messages(chatUID)
      .push({
        userUID: authUser?.uid,
        text: text,
        dateTime: new Date().toUTCString(),
      })
      .then(() => {
        setChatText('');
        inputRef?.current?.focus();
      });
  };

  const onChatTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setChatText(event.target.value);
  };

  if (chatUID === '')
    return (
      <Typography variant="h6" className={classes.textAlign}>
        Please select a chat
      </Typography>
    );
  return (
    <div className={classes.chatDiv}>
      <List className={classes.chat}>
        {messages.length === 0 ? (
          <Typography variant="h6" className={classes.textAlign}>
            Start a conversation by sending a message below
          </Typography>
        ) : (
          messages.map((message, index) => (
            <ChatBubble message={message} users={users} key={index} />
          ))
        )}
        <div ref={messagesEndRef} />
      </List>
      <CustomDivider />
      <div className={classes.inputChatDiv}>
        <OutlinedTextField
          inputRef={inputRef}
          label="Message"
          placeholder="Insert Message Here"
          onChangeHandler={onChatTextChange}
          value={chatText}
        />
        <Tooltip title="Send Message">
          <IconButton
            component="label"
            color="primary"
            disabled={chatText === ''}
            onClick={(): void => sendMessage(chatText)}
          >
            <SendIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

Chat.propTypes = {
  chatUID: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
};
