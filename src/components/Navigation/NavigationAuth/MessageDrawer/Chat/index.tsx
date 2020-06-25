import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Message } from '../../../../../constants/interfaces';
import { FirebaseContext } from '../../../../Firebase/context';
import { AuthUserContext } from '../../../../Authentication/AuthProvider/context';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputChatDiv: {
    display: 'flex',
    flexDirection: 'column',
    height: '100px',
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
  },
  chatItem: {
    overflowWrap: 'anywhere',
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
  },
  chatInput: {
    marginBottom: '5px',
    width: '250px',
  },
  sendMessage: {
    marginTop: '5px',
    width: '250px',
  },
  textAlign: {
    textAlign: 'center',
  },
}));

interface ChatProps {
  chatUID: string;
}

export const Chat: React.FC<ChatProps> = ({ chatUID }) => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const classes = useStyles();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatText, setChatText] = useState<string>('');

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
        {messages.map((message) => (
          <ListItem key={message.dateTime}>
            <ListItemText className={classes.chatItem} primary={message.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <div className={classes.inputChatDiv}>
        <TextField
          className={classes.chatInput}
          placeholder="Insert Message Here"
          multiline
          onChange={onChatTextChange}
          value={chatText}
        />
        <Button
          className={classes.sendMessage}
          onClick={(): void => sendMessage(chatText)}
          color="primary"
          variant="contained"
          disabled={chatText === ''}
        >
          Send Message
        </Button>
      </div>
    </div>
  );
};

Chat.propTypes = {
  chatUID: PropTypes.string.isRequired,
};
