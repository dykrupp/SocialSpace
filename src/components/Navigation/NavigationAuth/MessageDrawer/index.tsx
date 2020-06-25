import React, { useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, Theme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { UserProfileUID } from '../../../../constants/interfaces';
import { ChatList } from './ChatList';
import { Chat } from './Chat';

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
}

export const MessageDrawer: React.FC<MessageDrawerProps> = ({
  isDrawerOpen,
  setIsDrawerOpen,
  users,
}) => {
  const classes = useStyles();
  const [selectedChatUID, setSelectedChatUID] = useState('');

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
          <ChevronRightIcon />
        </IconButton>
      </div>
      <Divider />
      <ChatList users={users} onChatClick={onChatClick} />
      <Divider />
      <Chat chatUID={selectedChatUID} />
    </Drawer>
  );
};

MessageDrawer.propTypes = {
  isDrawerOpen: PropTypes.bool.isRequired,
  setIsDrawerOpen: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
};
