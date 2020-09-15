import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { AccountInfoProps } from '../../../../utils/constants/interfaces';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { getFirstName } from '../../../../utils/helperFunctions';
import { useHistory } from 'react-router';
import * as ROUTES from '../../../../utils/constants/routes';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  flex: {
    display: 'flex',
  },
  aboutMe: {
    display: 'flex',
    overflowWrap: 'break-word',
    textAlign: 'center',
    width: '585px',
    flexDirection: 'column',
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
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
  },
  rowItemInfo: {
    width: '292.5px',
    textAlign: 'center',
  },
  accountImageColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    textAlign: 'center',
  },
  subHeading: {
    marginBottom: '-1px',
  },
  overflowSubheader: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
}));

export const AccountInfo: React.FC<AccountInfoProps> = ({
  userProfile,
  isUsersProfile,
  isFollowingUser,
  followUser,
  unfollowUser,
}) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.flex}>
      <div className={classes.accountImageColumn}>
        {userProfile.profilePicURL === '' ? (
          <AccountCircle className={classes.profileImage} />
        ) : (
          <img
            src={userProfile.profilePicURL}
            className={classes.profileImage}
            alt="Profile"
          />
        )}
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
            Follow
          </Button>
        )}
        {!isUsersProfile && isFollowingUser && (
          <Button
            color="secondary"
            variant="contained"
            onClick={(): void => unfollowUser()}
          >
            Unfollow
          </Button>
        )}
      </div>
      <div className={classes.flexColumn}>
        <div className={classes.flex}>
          <div className={classes.flexColumn}>
            <div className={classes.flex}>
              <div className={classes.rowItemInfo}>
                <h2 className={classes.subHeading}>Full Name:</h2>
                <Tooltip title={userProfile.fullName}>
                  <Typography
                    className={classes.overflowSubheader}
                    variant="h6"
                  >
                    {userProfile.fullName}
                  </Typography>
                </Tooltip>
              </div>
              <div className={classes.rowItemInfo}>
                <h2 className={classes.subHeading}>Email:</h2>
                <Tooltip title={userProfile.email}>
                  <Typography
                    className={classes.overflowSubheader}
                    variant="h6"
                  >
                    {userProfile.email}
                  </Typography>
                </Tooltip>
              </div>
            </div>
            <div className={classes.flex}>
              <div className={classes.rowItemInfo}>
                <h2 className={classes.subHeading}>Birthday:</h2>
                <Typography variant="h6">{userProfile.birthday}</Typography>
              </div>
              <div className={classes.rowItemInfo}>
                <h2 className={classes.subHeading}>Gender:</h2>
                <Typography variant="h6">{userProfile.gender}</Typography>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.aboutMe}>
          <h2 className={classes.subHeading}>About Me:</h2>
          <Typography variant="h6">
            {`${
              userProfile.aboutMe === ''
                ? `We don't know anything about ${getFirstName(
                    userProfile.fullName
                  )}....`
                : userProfile.aboutMe
            }`}
          </Typography>
        </div>
      </div>
    </div>
  );
};

AccountInfo.propTypes = {
  userProfile: PropTypes.any.isRequired,
  isUsersProfile: PropTypes.bool.isRequired,
  isFollowingUser: PropTypes.bool.isRequired,
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired,
};
