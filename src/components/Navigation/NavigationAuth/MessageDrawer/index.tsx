import React, { useState, useContext } from 'react';
import Drawer from '@material-ui/core/Drawer';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, Theme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { UserProfileUID, ChatUID } from '../../../../constants/interfaces';
import { ChatList } from './ChatList';
import { Chat } from './Chat';
import { AuthUserContext } from '../../../Authentication/AuthProvider/context';
import { CustomDivider } from '../../../Reusable Components/CustomDivider/index';

const drawerWidth = '300px';

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
}));

interface MessageDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (state: boolean) => void;
  users: UserProfileUID[];
  chatUIDS: ChatUID[];
}

export const MessageDrawer: React.FC<MessageDrawerProps> = ({
  isDrawerOpen,
  setIsDrawerOpen,
  users,
  chatUIDS,
}) => {
  const classes = useStyles();
  const [selectedChatUID, setSelectedChatUID] = useState('');
  const authUser = useContext(AuthUserContext);

  const onChatClick = async (chatUID: string): Promise<void> => {
    setSelectedChatUID(chatUID);
  };

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="right"
      open={isDrawerOpen}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={(): void => setIsDrawerOpen(false)}>
          <ChevronRightIcon color="primary" />
        </IconButton>
      </div>
      <CustomDivider />
      <ChatList
        chatUIDS={chatUIDS}
        users={users.filter((x) => x.uid !== authUser?.uid)}
        onChatClick={onChatClick}
        currentChatUID={selectedChatUID}
      />
      <CustomDivider />
      <Chat chatUID={selectedChatUID} users={users} />
    </Drawer>
  );
};

MessageDrawer.propTypes = {
  isDrawerOpen: PropTypes.bool.isRequired,
  setIsDrawerOpen: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  chatUIDS: PropTypes.array.isRequired,
};
