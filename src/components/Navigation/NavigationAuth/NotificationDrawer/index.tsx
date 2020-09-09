import React, { useContext } from 'react';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, Theme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Notification, UserProfileUID } from '../../../../constants/interfaces';
import { CustomDivider } from '../../../Reusable Components/CustomDivider/index';
import { NotificationList } from './NotificationList';
import { Button, Tooltip } from '@material-ui/core';
import { FirebaseContext } from '../../../Firebase/context';
import { AuthUserContext } from '../../../Authentication/AuthProvider/context';

//TODO -> Convert to using Redux State Management instead of using Context

const drawerWidth = '350px';

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
  bottomDiv: {
    height: '50px',
    justifyContent: 'center',
    alignContent: 'center',
    display: 'flex',
    margin: '10px',
  },
  clearAllButton: {
    margin: '5px',
  },
}));

interface NotificationDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (state: boolean) => void;
  notifications: Notification[];
  users: UserProfileUID[];
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isDrawerOpen,
  setIsDrawerOpen,
  notifications,
  users,
}) => {
  const classes = useStyles();
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);

  const clearNotifications = (): void => {
    if (firebase && authUser) {
      firebase.notifications(authUser.uid).remove();
    }
  };

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={isDrawerOpen}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <Tooltip title="Close Notifications">
          <IconButton onClick={(): void => setIsDrawerOpen(false)}>
            <ChevronLeftIcon color="primary" />
          </IconButton>
        </Tooltip>
      </div>
      <CustomDivider />
      <NotificationList
        notifications={notifications}
        users={users}
        isDrawerOpen={isDrawerOpen}
      />
      <CustomDivider />
      <div className={classes.bottomDiv}>
        <Button
          className={classes.clearAllButton}
          onClick={clearNotifications}
          color="primary"
          variant="contained"
          startIcon={<DeleteIcon />}
        >
          Clear All
        </Button>
      </div>
    </Drawer>
  );
};

NotificationDrawer.propTypes = {
  isDrawerOpen: PropTypes.bool.isRequired,
  setIsDrawerOpen: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
};
