import React, { useContext, useState } from 'react';
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

const useStyles = makeStyles(() => ({
  flexDiv: {
    display: 'flex',
  },
  profileImage: {
    width: '125px',
    height: '125px',
    alignSelf: 'center',
  },
  editImage: {
    width: '60px',
    height: '60px',
  },
  accountInfoColumn: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
  },
  accountInfoRow: {
    display: 'flex',
    flex: '1',
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
  isUsersProfile: boolean;
}

export const AccountInfo: React.FC<AccountInfoProps> = ({
  userProfile,
  isUsersProfile,
}) => {
  const classes = useStyles();
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [isFollowingUser, setIsFollowingUser] = useState(false);

  const followUser = (): void => {
    if (authUser) {
      firebase
        ?.follower(userProfile.uid, authUser.uid)
        .set({ fullName: authUser.fullName })
        .then(() => setIsFollowingUser(true));

      firebase
        ?.following(authUser.uid, userProfile.uid)
        .set({ fullName: userProfile.fullName });
    }
  };

  const unFollowUser = (): void => {
    if (authUser) {
      firebase
        ?.follower(userProfile.uid, authUser.uid)
        .remove()
        .then(() => setIsFollowingUser(false));

      firebase?.following(authUser.uid, userProfile.uid).remove();
    }
  };

  return (
    <div className={classes.flexDiv}>
      <AccountCircle className={classes.profileImage} />
      <div className={classes.accountInfoColumn}>
        <div className={classes.flexDiv}>
          <div className={classes.accountInfoRow}>
            <h2>{`Full Name: ${userProfile.fullName}`}</h2>
          </div>
          <div className={classes.accountInfoRow}>
            <h2>{`Email: ${userProfile.email}`}</h2>
          </div>
        </div>
        <div className={classes.flexDiv}>
          <div className={classes.accountInfoRow}>
            <h2>{`Birthday: ${userProfile.birthday}`}</h2>
          </div>
          <div className={classes.accountInfoRow}>
            <h2>{`Gender: ${userProfile.gender}`}</h2>
          </div>
        </div>
      </div>
      <div className={classes.accountButtonColumn}>
        {isUsersProfile && (
          <Tooltip title="Edit Profile">
            <IconButton
              component="label"
              onClick={(): void =>
                console.log('Open modal or redirect to page here')
              }
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
  );
};

AccountInfo.propTypes = {
  userProfile: PropTypes.any.isRequired,
  isUsersProfile: PropTypes.bool.isRequired,
};
