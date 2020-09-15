import React from 'react';
import { AccountInfoProps } from '../../../../utils/constants/interfaces';
import PropTypes from 'prop-types';
import {
  Grid,
  makeStyles,
  Tooltip,
  IconButton,
  Button,
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from 'react-router-dom';
import * as ROUTES from '../../../../utils/constants/routes';
import { getFirstName } from '../../../../utils/helperFunctions';

const useStyles = makeStyles(() => ({
  profileImage: {
    width: '85px',
    height: '85px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacedRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  centeredInnerColumn: {
    display: 'flex',
    flex: '1',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  editImage: {
    width: '65px',
    height: '65px',
  },
  followButtons: {
    height: '50%',
  },
  aboutMe: {
    overflowWrap: 'break-word',
    textAlign: 'center',
  },
  ellipsedText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    marginTop: '-10px',
  },
  metaInfoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    textAlign: 'center',
    flexDirection: 'column',
    width: '50%',
  },
  subHeading: {
    fontWeight: 'bold',
    fontSize: '18px',
  },
  metaInfoText: {
    marginTop: '-10px',
  },
}));

export const MobileAccountInfo: React.FC<AccountInfoProps> = ({
  userProfile,
  isUsersProfile,
  isFollowingUser,
  followUser,
  unfollowUser,
  rootWidth,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const containerWidth = rootWidth - 40;

  return (
    <Grid container>
      <Grid item xs={12} className={classes.spacedRow}>
        <div className={classes.centeredInnerColumn}>
          {userProfile.profilePicURL === '' ? (
            <AccountCircle className={classes.profileImage} />
          ) : (
            <img
              src={userProfile.profilePicURL}
              alt="Profile"
              className={classes.profileImage}
            />
          )}
        </div>
        <div className={classes.centeredInnerColumn}>
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
              className={classes.followButtons}
              onClick={(): void => followUser()}
            >
              Follow
            </Button>
          )}
          {!isUsersProfile && isFollowingUser && (
            <Button
              color="secondary"
              variant="contained"
              className={classes.followButtons}
              onClick={(): void => unfollowUser()}
            >
              Unfollow
            </Button>
          )}
        </div>
      </Grid>
      <Grid
        item
        xs={12}
        className={classes.spacedRow}
        style={{ width: containerWidth }}
      >
        <div className={classes.metaInfoRow}>
          <p className={classes.subHeading}>Full Name:</p>
          <Tooltip title={userProfile.fullName}>
            <p className={classes.ellipsedText}>{`${userProfile.fullName}`}</p>
          </Tooltip>
        </div>
        <div className={classes.metaInfoRow}>
          <p className={classes.subHeading}>Email:</p>
          <Tooltip title={userProfile.email}>
            <p className={classes.ellipsedText}>{`${userProfile.email}`}</p>
          </Tooltip>
        </div>
      </Grid>
      <Grid item xs={12} className={classes.spacedRow}>
        <div className={classes.centeredInnerColumn}>
          <div>
            <p className={classes.subHeading}>Birthday:</p>
            <p className={classes.metaInfoText}>{`${userProfile.birthday}`}</p>
          </div>
        </div>
        <div className={classes.centeredInnerColumn}>
          <div>
            <p className={classes.subHeading}>Gender:</p>
            <p className={classes.metaInfoText}>{`${userProfile.gender}`}</p>
          </div>
        </div>
      </Grid>
      <div className={classes.aboutMe} style={{ width: containerWidth }}>
        <p className={classes.subHeading}>About Me:</p>
        <p className={classes.metaInfoText}>{`${
          userProfile.aboutMe === ''
            ? `We don't know anything about ${getFirstName(
                userProfile.fullName
              )}....`
            : userProfile.aboutMe
        }`}</p>
      </div>
    </Grid>
  );
};

MobileAccountInfo.propTypes = {
  userProfile: PropTypes.any.isRequired,
  isUsersProfile: PropTypes.bool.isRequired,
  isFollowingUser: PropTypes.bool.isRequired,
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired,
  rootWidth: PropTypes.number.isRequired,
};
