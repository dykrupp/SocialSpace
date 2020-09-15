import React, { useContext } from 'react';
import { AuthUserContext } from '../Authentication/AuthProvider/context';
import NavigationNonAuth from './NavigationNonAuth';
import { NavigationAuthContainer } from './NavigationAuth';
import { UserProfileUID } from '../../utils/constants/interfaces';
import PropTypes from 'prop-types';
import { useMobileComponents } from '../../utils/hooks/useMobileComponents';
import { Typography, makeStyles } from '@material-ui/core';
import * as ROUTES from '../../utils/constants/routes';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  title: {
    textAlign: 'center',
    marginTop: '15px',
  },
  mobileLink: {
    textDecoration: 'none',
    outline: 0,
    color: 'rgb(48, 63, 159)',
  },
}));

interface NavigationProps {
  users: UserProfileUID[];
}

const Navigation: React.FC<NavigationProps> = ({ users }) => {
  const renderMobileComponents = useMobileComponents();

  return (
    <div>
      {useContext(AuthUserContext) ? (
        <NavigationAuthContainer users={users} />
      ) : renderMobileComponents ? (
        <MobileNonAuth />
      ) : (
        <NavigationNonAuth />
      )}
    </div>
  );
};

Navigation.propTypes = {
  users: PropTypes.array.isRequired,
};

export default Navigation;

const MobileNonAuth: React.FC = () => {
  const classes = useStyles();

  return (
    <Typography className={classes.title} variant="h4" noWrap>
      <Link
        title="Go to SocialSpace Home"
        to={ROUTES.HOME}
        className={classes.mobileLink}
      >
        SocialSpace
      </Link>
    </Typography>
  );
};
