import React, { useContext, useState, useEffect } from 'react';
import { fade, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import * as ROUTES from '../../../constants/routes';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../../Firebase/context';
import { useHistory } from 'react-router';
import { AuthUserContext } from '../../Authentication/AuthProvider/context';
import { UserProfileUID } from '../../../constants/interfaces';

const useStyles = makeStyles((theme: Theme) => ({
  mainDiv: {
    flexGrow: 1,
    minWidth: '760px',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'flex',
    width: '200px',
    justifyContent: 'center',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      minWidth: '250px',
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100% !important',
    [theme.breakpoints.up('md')]: {
      width: '100% !important',
    },
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
  searchInput: {
    color: 'white',
    marginLeft: '50px',
  },
}));

const NavigationAuth: React.FC = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const [
    mobileMoreAnchorEl,
    setMobileMoreAnchorEl,
  ] = React.useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const firebase = useContext(FirebaseContext);
  const history = useHistory();
  const authUser = useContext(AuthUserContext);
  const [users, setUsers] = useState<UserProfileUID[]>([]);
  const [searchString, setSearchString] = useState('');

  const onSearchSubmit = (): void => {
    const searchedUser = users.find((user) => user.fullName === searchString);
    if (searchedUser) history.push(`${ROUTES.PROFILE}/${searchedUser.uid}`);
  };

  useEffect(() => {
    firebase?.users().on('value', (snapshot) => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map((key) => ({
        ...usersObject[key],
        uid: key,
      })) as UserProfileUID[];

      setUsers(usersList.filter((user) => user.uid !== authUser?.uid));
    });

    return function cleanup(): void {
      firebase?.users().off();
    };
  }, [firebase, authUser]);

  const handleChange = (event: React.ChangeEvent<{}>, value: string): void => {
    setSearchString(value);
  };

  const handleProfileMenuOpen = (
    event: React.MouseEvent<HTMLElement>
  ): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = (): void => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = (): void => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {firebase && (
        <MenuItem
          onClick={(): void => {
            handleMenuClose();
            history.push(`${ROUTES.PROFILE}/${authUser?.uid}`);
          }}
        >
          Profile
        </MenuItem>
      )}
      {firebase && (
        <MenuItem
          onClick={(): void => {
            handleMenuClose();
            history.push(ROUTES.SETTINGS);
          }}
        >
          Settings
        </MenuItem>
      )}
      {firebase && (
        <MenuItem
          onClick={(): void => {
            firebase.signOut();
            handleMenuClose();
          }}
        >
          Log Out
        </MenuItem>
      )}
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.mainDiv}>
      <AppBar position="static">
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
          <div className={classes.grow}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <Autocomplete
                freeSolo
                classes={{
                  input: classes.searchInput,
                }}
                autoComplete={true}
                inputValue={searchString}
                onInputChange={handleChange}
                onKeyPress={(
                  event: React.KeyboardEvent<HTMLDivElement>
                ): void => {
                  if (event.key === 'Enter') onSearchSubmit();
                }}
                options={users.map((option) => option.fullName)}
                renderInput={(params): JSX.Element => <TextField {...params} />}
              />
            </div>
          </div>
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
};

export default NavigationAuth;
