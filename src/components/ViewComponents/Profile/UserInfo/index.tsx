import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../../constants/routes';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { convertToUserProfile } from '../../../../utils/helperFunctions';
import { FirebaseContext } from '../../../Firebase/context';
import { UserProfileUID } from '../../../../constants/interfaces';
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
    fontSize: '55px',
  },
  profilePic: {
    height: '55px',
  },
}));

interface UserInfoProps {
  userUID: string;
  setTabIndex: (index: number) => void;
}

export const UserInfo: React.FC<UserInfoProps> = ({ userUID, setTabIndex }) => {
  const classes = useStyles();
  const firebase = useContext(FirebaseContext);
  const [userProfile, setUserProfile] = useState<UserProfileUID>();

  useEffect(() => {
    firebase?.user(userUID).once('value', (snapShot) => {
      setUserProfile(convertToUserProfile(snapShot, userUID));
    });
  }, [userUID, firebase]);

  if (!userProfile) return null;
  const { fullName, profilePicURL } = userProfile;
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
        to={`${ROUTES.PROFILE}/${userUID}`}
        onClick={(): void => setTabIndex(0)}
      >
        {fullName}
      </Link>
    </div>
  );
};

UserInfo.propTypes = {
  userUID: PropTypes.string.isRequired,
  setTabIndex: PropTypes.func.isRequired,
};
