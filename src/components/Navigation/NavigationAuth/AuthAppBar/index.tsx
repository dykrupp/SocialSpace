import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MoreIcon from '@material-ui/icons/MoreVert';
import HomeIcon from '@material-ui/icons/Home';
import * as ROUTES from '../../../../constants/routes';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { SearchBar } from './SearchBar';
import { DesktopButtonNav } from './DesktopButtonNav';
import { UserProfileUID } from '../../../../constants/interfaces';
import { headerHeight } from '../index';
import { useMobileComponents } from '../../../../utils/hooks/useMobileComponents';
import { Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  searchBar: {
    display: 'flex',
    flex: '1',
    justifyContent: 'center',
  },
  title: {
    display: 'flex',
    width: '200px',
    justifyContent: 'center',
  },
  sectionDesktop: {
    display: 'flex',
    width: '200px',
    justifyContent: 'center',
  },
  sectionMobile: {
    display: 'flex',
    marginRight: '-15px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    outline: 0,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    height: headerHeight,
  },
  toolBar: {
    minHeight: headerHeight,
  },
  homeButton: {
    marginLeft: '-15px',
  },
}));

interface AuthAppBarProps {
  setIsMessageDrawerOpen: (isOpen: React.SetStateAction<boolean>) => void;
  handleUserMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleMobileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  setIsNotificationDrawerOpen: (isOpen: React.SetStateAction<boolean>) => void;
  unreadNotificationCount: number;
  unreadMessageCount: number;
  users: UserProfileUID[];
}

export const AuthAppBar: React.FC<AuthAppBarProps> = ({
  setIsMessageDrawerOpen,
  handleUserMenuOpen,
  handleMobileMenuOpen,
  users,
  unreadMessageCount,
  setIsNotificationDrawerOpen,
  unreadNotificationCount,
}) => {
  const classes = useStyles();
  const isMobile = useMobileComponents();
  const history = useHistory();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolBar}>
        {isMobile ? (
          <Tooltip title="Go to SocialSpace Home">
            <IconButton
              className={classes.homeButton}
              onClick={(): void => history.push(ROUTES.HOME)}
              color="inherit"
            >
              <HomeIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Typography className={classes.title} variant="h6" noWrap>
            <Link
              className={classes.link}
              title="Go to SocialSpace Home"
              to={ROUTES.HOME}
            >
              SocialSpace
            </Link>
          </Typography>
        )}
        <div className={classes.searchBar}>
          <SearchBar users={users} />
        </div>
        {isMobile ? (
          <div className={classes.sectionMobile}>
            <IconButton onClick={handleMobileMenuOpen} color="inherit">
              <MoreIcon />
            </IconButton>
          </div>
        ) : (
          <div className={classes.sectionDesktop}>
            <DesktopButtonNav
              setIsMessageDrawerOpen={setIsMessageDrawerOpen}
              handleUserMenuOpen={handleUserMenuOpen}
              unreadMessageCount={unreadMessageCount}
              unreadNotificationCount={unreadNotificationCount}
              setIsNotificationDrawerOpen={setIsNotificationDrawerOpen}
            />
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

AuthAppBar.propTypes = {
  setIsMessageDrawerOpen: PropTypes.func.isRequired,
  handleMobileMenuOpen: PropTypes.func.isRequired,
  handleUserMenuOpen: PropTypes.func.isRequired,
  setIsNotificationDrawerOpen: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  unreadNotificationCount: PropTypes.number.isRequired,
  unreadMessageCount: PropTypes.number.isRequired,
};
