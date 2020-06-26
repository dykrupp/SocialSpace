import React, { useContext } from 'react';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { AuthUserContext } from '../../../../Authentication/AuthProvider/context';
import AccountCircle from '@material-ui/icons/AccountCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../../../constants/routes';
import {
  Comment as CommentInterface,
  UserProfileUID,
} from '../../../../../constants/interfaces';
import { calcTimeSince } from '../../../../../utils/helperFunctions';

interface CommentProps {
  comment: CommentInterface;
  deleteComment: (commentDateTime: string) => void;
  userProfile: UserProfileUID | undefined;
}

const commentStyles = makeStyles(() => ({
  commentPaper: {
    width: '100%',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#e9ebee',
  },
  profileInfo: {
    display: 'flex',
    flex: '1',
  },
  commentDiv: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  commentText: {
    textAlign: 'center',
  },
  accountCircle: {
    fontSize: '25px',
  },
  profilePic: {
    height: '48px',
    borderRadius: '50%',
  },
  link: {
    textDecoration: 'none',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    marginLeft: '10px',
  },
}));

export const Comment: React.FC<CommentProps> = ({
  comment,
  deleteComment,
  userProfile,
}) => {
  const classes = commentStyles();
  const authUser = useContext(AuthUserContext);

  if (!userProfile) return null;
  const { profilePicURL, fullName } = userProfile;
  return (
    <Paper elevation={2} variant="outlined" className={classes.commentPaper}>
      <div className={classes.commentDiv}>
        <div className={classes.profileInfo}>
          {profilePicURL === '' && (
            <AccountCircle className={classes.accountCircle} />
          )}
          {profilePicURL !== '' && (
            <img
              src={profilePicURL}
              className={classes.profilePic}
              alt="Profile"
            />
          )}
          <Link
            className={classes.link}
            to={`${ROUTES.PROFILE}/${userProfile.uid}`}
          >
            {fullName}
          </Link>
        </div>
        <p>{calcTimeSince(Date.parse(comment.dateTime))}</p>
        {authUser?.fullName === fullName && (
          <Tooltip title="Delete Comment">
            <IconButton
              component="label"
              onClick={(): void => deleteComment(comment.dateTime)}
            >
              <DeleteIcon color="primary" />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <p className={classes.commentText}>{comment.comment}</p>
    </Paper>
  );
};

Comment.propTypes = {
  comment: PropTypes.any.isRequired,
  deleteComment: PropTypes.func.isRequired,
  userProfile: PropTypes.any.isRequired,
};
