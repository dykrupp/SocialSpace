import React, { useState, useRef, useEffect, useContext } from 'react';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CommentIcon from '@material-ui/icons/Comment';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import {
  Notification,
  UserProfileUID,
} from '../../../../../constants/interfaces';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { FirebaseContext } from '../../../../Firebase/context';
import { AuthUserContext } from '../../../../Authentication/AuthProvider/context';
import {
  calcTimeSince,
  getSortedObjects,
} from '../../../../../utils/helperFunctions';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import { Tooltip, Typography } from '@material-ui/core';

interface NotificationListProps {
  notifications: Notification[];
  users: UserProfileUID[];
  isDrawerOpen: boolean;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    paddingTop: '0px',
    paddingBottom: '0px',
    overflowY: 'auto',
    minHeight: '100px',
  },
  notificationTypeImage: {
    fontSize: '35px',
  },
  selectedItem: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  unreadIconDiv: {
    width: '25px',
  },
  emptyOverlay: {
    textAlign: 'center',
  },
}));

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  users,
  isDrawerOpen,
}) => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const notificationsStartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToTop = (): void => {
      if (notificationsStartRef.current) {
        notificationsStartRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    scrollToTop();
  }, [notificationsStartRef]);

  if (notifications.length === 0)
    return (
      <Typography
        className={`${classes.root} ${classes.emptyOverlay}`}
        variant="h6"
      >
        Explore SocialSpace for more interactions
      </Typography>
    );
  return (
    <List className={classes.root}>
      <div ref={notificationsStartRef} />
      {getSortedObjects(notifications).map(
        (notification: Notification, index) => {
          const triggerUser = users.find(
            (user) => user.uid === notification.triggerUserUID
          );

          if (!triggerUser) return null;
          return (
            <NotificationListItem
              key={index}
              notification={notification}
              index={index}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              triggerUser={triggerUser}
              isDrawerOpen={isDrawerOpen}
            />
          );
        }
      )}
    </List>
  );
};

NotificationList.propTypes = {
  notifications: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  isDrawerOpen: PropTypes.any.isRequired,
};

interface NotificationListItemProps {
  notification: Notification;
  setSelectedIndex: (index: number) => void;
  index: number;
  selectedIndex?: number | null;
  triggerUser: UserProfileUID;
  isDrawerOpen: boolean;
}

const NotificationListItem: React.FC<NotificationListItemProps> = ({
  notification,
  index,
  selectedIndex,
  setSelectedIndex,
  triggerUser,
  isDrawerOpen,
}) => {
  const classes = useStyles();
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [timeSince, setTimeSince] = useState(
    calcTimeSince(Date.parse(notification.dateTime))
  );

  const markNotificationRead = (): void => {
    if (firebase && authUser && !notification.read) {
      firebase
        .notification(authUser.uid, notification.notificationUID)
        .update({ read: true });
    }
  };

  const notificationIcon = {
    comment: (
      <CommentIcon color="primary" className={classes.notificationTypeImage} />
    ),
    follower: (
      <PersonPinIcon
        color="primary"
        className={classes.notificationTypeImage}
      />
    ),
    like: (
      <FavoriteIcon
        color="secondary"
        className={classes.notificationTypeImage}
      />
    ),
  };

  const notificationText = {
    comment: `${triggerUser.fullName} commented on your post`,
    follower: `${triggerUser.fullName} followed you`,
    like: `${triggerUser.fullName} liked your post`,
  };

  //only recalculate timeSince when the drawer is reopened
  useEffect(() => {
    if (isDrawerOpen)
      setTimeSince(calcTimeSince(Date.parse(notification.dateTime)));
  }, [isDrawerOpen, notification]);

  return (
    <ListItem
      button
      className={`${selectedIndex === index ? classes.selectedItem : ''}`}
      onClick={(): void => {
        setSelectedIndex(index);
        markNotificationRead();
      }}
    >
      <ListItemAvatar>{notificationIcon[notification.type]}</ListItemAvatar>
      <ListItemText
        primary={notificationText[notification.type]}
        secondary={timeSince}
      />
      <div className={classes.unreadIconDiv}>
        {!notification.read && (
          <Tooltip title="Unread Notification">
            <PriorityHighIcon color="secondary" />
          </Tooltip>
        )}
      </div>
    </ListItem>
  );
};

NotificationListItem.propTypes = {
  notification: PropTypes.any.isRequired,
  index: PropTypes.number.isRequired,
  selectedIndex: PropTypes.any,
  setSelectedIndex: PropTypes.func.isRequired,
  triggerUser: PropTypes.any.isRequired,
  isDrawerOpen: PropTypes.any.isRequired,
};
