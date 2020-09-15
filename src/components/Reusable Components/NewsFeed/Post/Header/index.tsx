import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import { calcTimeSince } from '../../../../../utils/helperFunctions';
import { AuthUserContext } from '../../../../Authentication/AuthProvider/context';
import { Link } from 'react-router-dom';
import AccountCircle from '@material-ui/icons/AccountCircle';
import * as ROUTES from '../../../../../utils/constants/routes';

const headerStyles = makeStyles(() => ({
  link: {
    textDecoration: 'none',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    marginLeft: '10px',
  },
  gridRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  profileInfo: {
    display: 'flex',
    flex: '1',
  },
  accountIconSize: {
    fontSize: '55px',
  },
  profileImage: {
    height: '55px',
    borderRadius: '50%',
  },
  timeAgo: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
    fontSize: '12px',
    marginTop: '-10px',
    marginBottom: '-10px',
  },
  deletePostButton: {
    marginLeft: 'auto',
  },
}));

interface HeaderProps {
  dateTime: string;
  profilePicURL: string;
  fullName: string;
  userUID: string;
  deletePost: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  dateTime,
  fullName,
  profilePicURL,
  deletePost,
  userUID,
}) => {
  const classes = headerStyles();
  const authUser = useContext(AuthUserContext);

  return (
    <Grid item container xs={12} className={classes.gridRow}>
      <p className={classes.timeAgo}>{calcTimeSince(Date.parse(dateTime))}</p>
      <Grid item xs={12}>
        <div className={classes.profileInfo}>
          {profilePicURL === '' && (
            <AccountCircle className={classes.accountIconSize} />
          )}
          {profilePicURL !== '' && (
            <img
              src={profilePicURL}
              className={classes.profileImage}
              alt="Profile"
            />
          )}
          <Link className={classes.link} to={`${ROUTES.PROFILE}/${userUID}`}>
            {fullName}
          </Link>
          {fullName === authUser?.fullName && (
            <Tooltip title="Delete Post">
              <IconButton
                component="label"
                onClick={deletePost}
                className={classes.deletePostButton}
              >
                <DeleteIcon color="primary" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </Grid>
    </Grid>
  );
};

Header.propTypes = {
  fullName: PropTypes.string.isRequired,
  dateTime: PropTypes.string.isRequired,
  userUID: PropTypes.string.isRequired,
  profilePicURL: PropTypes.string.isRequired,
  deletePost: PropTypes.func.isRequired,
};
