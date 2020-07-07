import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, Theme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Notification } from '../../../../constants/interfaces';
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

interface NotificationDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (state: boolean) => void;
  notifications: Notification[];
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isDrawerOpen,
  setIsDrawerOpen,
  notifications,
}) => {
  const classes = useStyles();

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
        <IconButton onClick={(): void => setIsDrawerOpen(false)}>
          <ChevronLeftIcon color="primary" />
        </IconButton>
      </div>
      <CustomDivider />
    </Drawer>
  );
};

NotificationDrawer.propTypes = {
  isDrawerOpen: PropTypes.bool.isRequired,
  setIsDrawerOpen: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired,
};
