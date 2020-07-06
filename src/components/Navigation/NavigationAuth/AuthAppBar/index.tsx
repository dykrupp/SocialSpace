import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MoreIcon from '@material-ui/icons/MoreVert';
import * as ROUTES from '../../../../constants/routes';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { SearchBar } from './SearchBar';
import { DesktopButtonNav } from './DesktopButtonNav';
import { UserProfileUID, ChatUID } from '../../../../constants/interfaces';

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
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      width: '200px',
      justifyContent: 'center',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    outline: 0,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

interface AuthAppBarProps {
  setIsMessageDrawerOpen: (isOpen: React.SetStateAction<boolean>) => void;
  handleUserMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleMobileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  users: UserProfileUID[];
  chatUIDS: ChatUID[];
}

export const AuthAppBar: React.FC<AuthAppBarProps> = ({
  setIsMessageDrawerOpen,
  handleUserMenuOpen,
  handleMobileMenuOpen,
  users,
  chatUIDS,
}) => {
  const classes = useStyles();

  return (
    <AppBar position="relative" className={classes.appBar}>
      <Toolbar variant="dense">
        <Typography className={classes.title} variant="h6" noWrap>
          <Link
            className={classes.link}
            title="Go to SocialSpace Home"
            to={ROUTES.HOME}
          >
            SocialSpace
          </Link>
        </Typography>
        <div className={classes.searchBar}>
          <SearchBar users={users} />
        </div>
        <div className={classes.sectionDesktop}>
          <DesktopButtonNav
            setIsMessageDrawerOpen={setIsMessageDrawerOpen}
            handleUserMenuOpen={handleUserMenuOpen}
            chatUIDS={chatUIDS}
          />
        </div>
        <div className={classes.sectionMobile}>
          <IconButton onClick={handleMobileMenuOpen} color="inherit">
            <MoreIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

AuthAppBar.propTypes = {
  setIsMessageDrawerOpen: PropTypes.func.isRequired,
  handleMobileMenuOpen: PropTypes.func.isRequired,
  handleUserMenuOpen: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  chatUIDS: PropTypes.array.isRequired,
};