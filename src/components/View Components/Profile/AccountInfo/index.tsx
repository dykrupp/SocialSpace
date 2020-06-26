import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { UserProfileUID } from '../../../../constants/interfaces';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { getFirstName } from '../../../../utils/helperFunctions';
import { FirebaseContext } from '../../../Firebase/context';
import { AuthUserContext } from '../../../Authentication/AuthProvider/context';
import { useHistory } from 'react-router';
import * as ROUTES from '../../../../constants/routes';

const useStyles = makeStyles(() => ({
  flexDiv: {
    display: 'flex',
  },
  aboutMe: {
    display: 'flex',
    justifyContent: 'center',
  },
  profileImage: {
    width: '125px',
    height: '125px',
    alignSelf: 'center',
    borderRadius: '50%',
  },
  editImage: {
    width: '50px',
    height: '50px',
  },
  accountInfoColumn: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
  },
  accountInfoRow: {
    display: 'flex',
    width: '50%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountButtonColumn: {
    display: 'flex',
    width: '200px',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

interface AccountInfoProps {
  userProfile: UserProfileUID;
}

export const AccountInfo: React.FC<AccountInfoProps> = ({ userProfile }) => {
  const classes = useStyles();
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const history = useHistory();
  let followerKey = '';
  let followingKey = '';

  const followUser = (): void => {
    if (authUser) {
      firebase
        ?.followers(userProfile.uid)
        .push({ userUID: authUser.uid })
        .then((ref) => {
          followerKey = ref.key ? ref.key : '';
          setIsFollowingUser(true);
        });

      firebase
        ?.followings(authUser.uid)
        .push({ userUID: userProfile.uid })
        .then((ref) => {
          followingKey = ref.key ? ref.key : '';
        });
    }
  };

  const unFollowUser = (): void => {
    if (authUser && firebase) {
      firebase
        .follower(userProfile.uid, followerKey)
        .remove()
        .then(() => setIsFollowingUser(false));

      firebase.following(authUser.uid, followingKey).remove();
    }
  };

  useEffect(() => {
    if (authUser && userProfile && userProfile.followers) {
      setIsFollowingUser(
        userProfile.followers.some((x) => x.userUID === authUser.uid)
      );
    }
  }, [authUser, userProfile]);

  const isUsersProfile = authUser ? authUser.uid === userProfile.uid : false;

  return (
    <div>
      <div className={classes.flexDiv}>
        {userProfile.profilePicURL === '' && (
          <AccountCircle className={classes.profileImage} />
        )}
        {userProfile.profilePicURL !== '' && (
          <img
            src={userProfile.profilePicURL}
            className={classes.profileImage}
            alt="Profile"
          />
        )}
        <div className={classes.accountInfoColumn}>
          <div className={classes.flexDiv}>
            <div className={classes.accountInfoRow}>
              <h3>
                Full Name: <br /> {userProfile.fullName}
              </h3>
            </div>
            <div className={classes.accountInfoRow}>
              <h3>
                Email: <br /> {userProfile.email}
              </h3>
            </div>
          </div>
          <div className={classes.flexDiv}>
            <div className={classes.accountInfoRow}>
              <h3>
                Birthday: <br /> {userProfile.birthday}
              </h3>
            </div>
            <div className={classes.accountInfoRow}>
              <h3>
                Gender: <br /> {userProfile.gender}
              </h3>
            </div>
          </div>
        </div>
        <div className={classes.accountButtonColumn}>
          {isUsersProfile && (
            <Tooltip title="Edit Profile">
              <IconButton
                component="label"
                onClick={(): void => history.push(ROUTES.EDIT_PROFILE)}
              >
                <EditIcon color="primary" className={classes.editImage} />
              </IconButton>
            </Tooltip>
          )}
          {!isUsersProfile && !isFollowingUser && (
            <Button
              color="primary"
              variant="contained"
              onClick={(): void => followUser()}
            >
              {`Follow ${getFirstName(userProfile.fullName)}`}
            </Button>
          )}
          {!isUsersProfile && isFollowingUser && (
            <Button
              color="secondary"
              variant="contained"
              onClick={(): void => unFollowUser()}
            >
              {`Unfollow ${getFirstName(userProfile.fullName)}`}
            </Button>
          )}
        </div>
      </div>
      <div className={classes.aboutMe}>
        <h3>{`About: ${
          userProfile.aboutMe === ''
            ? `We don't know anything about ${getFirstName(
                userProfile.fullName
              )}....`
            : userProfile.aboutMe
        }`}</h3>
      </div>
    </div>
  );
};

AccountInfo.propTypes = {
  userProfile: PropTypes.any.isRequired,
};
