import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ReceiptIcon from '@material-ui/icons/Receipt';
import TimelineIcon from '@material-ui/icons/Timeline';
import SearchIcon from '@material-ui/icons/Search';
import ChatIcon from '@material-ui/icons/Chat';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: '30px',
  },
  title: {
    fontWeight: 'bold',
  },
  listRoot: {
    marginTop: '25px',
    width: '100%',
    maxWidth: 520,
  },
  listItem: {
    paddingLeft: '0px',
  },
  listItemText: {
    fontWeight: 'bold',
  },
}));

const LandingInfo: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h4">
        Connect with friends and the world around you on SocialSpace.
      </Typography>
      <div className={classes.listRoot}>
        <List component="nav" aria-label="appInfo">
          <ListItem className={classes.listItem}>
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                className: classes.listItemText,
              }}
              primary="See photos and updates from friends in your News Feed."
            />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemIcon>
              <TimelineIcon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                className: classes.listItemText,
              }}
              primary="See what's new in your life on your personalized Timeline."
            />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                className: classes.listItemText,
              }}
              primary="Find more of what you're looking for with SocialSpace Search."
            />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemIcon>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                className: classes.listItemText,
              }}
              primary="Chat with your friends with SocialSpace Messenger."
            />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemIcon>
              <MoneyOffIcon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                className: classes.listItemText,
              }}
              primary="Feel safe knowing that we don't sell your information."
            />
          </ListItem>
        </List>
      </div>
    </div>
  );
};

export default LandingInfo;
