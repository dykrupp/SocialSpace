import React, { useState, useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { Message, UserProfileUID } from '../../../../../constants/interfaces';
import { FirebaseContext } from '../../../../Firebase/context';
import { AuthUserContext } from '../../../../Authentication/AuthProvider/context';
import { makeStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import { ChatBubble } from './ChatBubble';
import { OutlinedTextField } from '../../../../Resuable Components/OutlinedTextField';
import { CustomDivider } from '../CustomDivider';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(() => ({
  inputChatDiv: {
    display: 'flex',
    height: '50px',
    margin: '15px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatDiv: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 270px)',
  },
  chat: {
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    minHeight: '120px',
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

  const scrollToBottom = (): void => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(scrollToBottom, [messages]);

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
      .then(() => setChatText(''));
  };

  const onChatTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setChatText(event.target.value);
  };

  if (chatUID === '')
    return <h3 className={classes.textAlign}>Please select a chat</h3>;
  return (
    <div className={classes.chatDiv}>
      <List className={classes.chat}>
        {messages.map((message, index) => (
          <ChatBubble message={message} users={users} key={index} />
        ))}
        <div ref={messagesEndRef} />
      </List>
      <CustomDivider />
      <div className={classes.inputChatDiv}>
        <OutlinedTextField
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
