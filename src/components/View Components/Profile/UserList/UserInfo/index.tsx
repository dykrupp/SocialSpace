import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../../../constants/routes';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { UserProfileUID } from '../../../../../constants/interfaces';
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles(() => ({
  link: {
    textDecoration: 'none',
    fontSize: '25px',
    marginLeft: '10px',
  },
  mainDiv: {
    display: 'flex',
    alignItems: 'center',
  },
  accountIcon: {
    fontSize: '75px',
    width: '85px',
  },
  profilePic: {
    width: '85px',
  },
}));

interface UserInfoProps {
  userProfile: UserProfileUID | undefined;
  setTabIndex: (index: number) => void;
}

export const UserInfo: React.FC<UserInfoProps> = ({
  userProfile,
  setTabIndex,
}) => {
  const classes = useStyles();

  if (!userProfile) return null;
  const { fullName, profilePicURL, uid } = userProfile;
  return (
    <div className={classes.mainDiv}>
      {profilePicURL === '' && (
        <AccountCircle className={classes.accountIcon} />
      )}
      {profilePicURL !== '' && (
        <img src={profilePicURL} className={classes.profilePic} alt="Profile" />
      )}
      <Link
        className={classes.link}
        to={`${ROUTES.PROFILE}/${uid}`}
        onClick={(): void => setTabIndex(0)}
      >
        {fullName}
      </Link>
    </div>
  );
};

UserInfo.propTypes = {
  userProfile: PropTypes.any.isRequired,
  setTabIndex: PropTypes.func.isRequired,
};
