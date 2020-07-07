import React, { useState, useRef, useEffect } from 'react';
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
import {
  calcTimeSince,
  getSortedObjects,
} from '../../../../../utils/helperFunctions';

interface NotificationListProps {
  notifications: Notification[];
  users: UserProfileUID[];
}

const useStyles = makeStyles(() => ({
  list: {
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
}));

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  users,
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

  return (
    <List className={classes.list}>
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
};

interface NotificationListItemProps {
  notification: Notification;
  setSelectedIndex: (index: number) => void;
  index: number;
  selectedIndex?: number | null;
  triggerUser: UserProfileUID;
}

const NotificationListItem: React.FC<NotificationListItemProps> = ({
  notification,
  index,
  selectedIndex,
  setSelectedIndex,
  triggerUser,
}) => {
  const classes = useStyles();
  const timeSince = calcTimeSince(Date.parse(notification.dateTime));

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
    comment: `${triggerUser.fullName} commented on your post ${timeSince}`,
    follower: `${triggerUser.fullName} followed you ${timeSince}`,
    like: `${triggerUser.fullName} liked your post ${timeSince}`,
  };

  return (
    <ListItem
      button
      className={`${selectedIndex === index ? classes.selectedItem : ''}`}
      onClick={(): void => {
        setSelectedIndex(index);
      }}
    >
      <ListItemAvatar>{notificationIcon[notification.type]}</ListItemAvatar>
      <ListItemText primary={notificationText[notification.type]} />
    </ListItem>
  );
};

NotificationListItem.propTypes = {
  notification: PropTypes.any.isRequired,
  index: PropTypes.number.isRequired,
  selectedIndex: PropTypes.any,
  setSelectedIndex: PropTypes.func.isRequired,
  triggerUser: PropTypes.any.isRequired,
};
