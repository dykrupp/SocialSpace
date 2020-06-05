import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { UserProfile } from '../../../../constants/interfaces';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { getFirstName } from '../../../../utils/helperFunctions';

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
  userProfile: UserProfile;
  isUsersProfile: boolean;
}

export const AccountInfo: React.FC<AccountInfoProps> = ({
  userProfile,
  isUsersProfile,
}) => {
  const classes = useStyles();

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
        {isUsersProfile ? (
          <Tooltip title="Edit Profile">
            <IconButton
              component="label"
              onClick={(): void =>
                console.log('Open modal or redirecto page here')
              }
            >
              <EditIcon color="primary" className={classes.editImage} />
            </IconButton>
          </Tooltip>
        ) : (
          <Button color="primary" variant="contained">
            {`Follow ${getFirstName(userProfile.fullName)}`}
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
