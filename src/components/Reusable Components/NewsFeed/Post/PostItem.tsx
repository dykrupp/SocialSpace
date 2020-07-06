import React, { useContext } from 'react';
import { Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import CommentIcon from '@material-ui/icons/Comment';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { AuthUserContext } from '../../../Authentication/AuthProvider/context';
import { Comment } from './Comment';
import { Header } from './Header';
import {
  Like,
  Comment as CommentInterface,
  UserProfileUID,
} from '../../../../constants/interfaces';
import { OutlinedTextField } from '../../OutlinedTextField';
import { areFriends } from '../../../../utils/helperFunctions';
import AddCommentIcon from '@material-ui/icons/AddComment';

const postStyles = makeStyles(() => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
  },
  centeredRow: {
    display: 'flex',
    justifyContent: 'center',
  },
  commentInputRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  commentButton: {
    maxHeight: '50px',
    minHeight: '50px',
    marginLeft: '20px',
  },
  marginLeft: {
    marginLeft: '20px',
  },
  imageMaxHeigt: {
    maxHeight: '250px',
  },
}));

interface PostStyleProps {
  deletePost: () => void;
  addLike: () => void;
  removeLike: () => void;
  onCommentButtonClick: () => void;
  onCommentChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  deleteComment: (comment: CommentInterface) => void;
  onCommentsOpenClick: () => void;
  isCommentsOpen: boolean;
  pendingComment: string;
  likes: Like[];
  comments: CommentInterface[];
  users: UserProfileUID[];
  post: string;
  dateTime: string;
  media: string;
  userProfile: UserProfileUID;
  postOwnerProfile: UserProfileUID;
}

export const PostItem: React.FC<PostStyleProps> = ({
  post,
  users,
  userProfile,
  dateTime,
  media,
  deletePost,
  addLike,
  removeLike,
  comments,
  likes,
  pendingComment,
  onCommentButtonClick,
  onCommentChange,
  deleteComment,
  isCommentsOpen,
  onCommentsOpenClick,
  postOwnerProfile,
}) => {
  const classes = postStyles();
  const authUser = useContext(AuthUserContext);
  const isCommentInvalid = pendingComment === '';
  const didCurrentUserLikePost = likes.find((x) => x.userUID === authUser?.uid);

  if (!authUser) return null;
  return (
    <Paper elevation={3} className={classes.paper}>
      <Grid container spacing={1}>
        <Header
          dateTime={dateTime}
          fullName={userProfile.fullName}
          profilePicURL={userProfile.profilePicURL}
          deletePost={deletePost}
          userUID={userProfile.uid}
        />
        <Grid item xs={12} className={classes.centeredRow}>
          <Typography variant="h6">{post}</Typography>
        </Grid>
        <Grid item xs={12} className={classes.centeredRow}>
          {media !== '' && (
            <img
              className={classes.imageMaxHeigt}
              src={media}
              alt="postedMedia"
            />
          )}
        </Grid>
        <Grid item xs={12} className={classes.centeredRow}>
          {areFriends(authUser, postOwnerProfile) ||
            (authUser.uid === postOwnerProfile.uid && (
              <>
                {!didCurrentUserLikePost && (
                  <Tooltip title="Like Post">
                    <IconButton
                      component="label"
                      onClick={(): void => addLike()}
                    >
                      <Badge badgeContent={likes.length} color="secondary">
                        <FavoriteBorderIcon color="secondary" />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                )}
                {didCurrentUserLikePost && (
                  <Tooltip title="Remove Like">
                    <IconButton
                      component="label"
                      onClick={(): void => removeLike()}
                    >
                      <Badge badgeContent={likes.length} color="secondary">
                        <FavoriteIcon color="secondary" />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                )}
              </>
            ))}
          {comments.length > 0 && (
            <Tooltip
              title={isCommentsOpen ? 'Close Comments' : 'View Comments'}
            >
              <IconButton
                component="label"
                onClick={(): void => onCommentsOpenClick()}
              >
                <Badge badgeContent={comments.length} color="secondary">
                  <CommentIcon color="primary" />
                </Badge>
              </IconButton>
            </Tooltip>
          )}
        </Grid>
        {isCommentsOpen &&
          comments.map((comment: CommentInterface) => (
            <Comment
              key={comment.dateTime}
              comment={comment}
              deleteComment={(): void => deleteComment(comment)}
              userProfile={users.find((x) => x.uid === comment.userUID)}
            />
          ))}
        {areFriends(authUser, postOwnerProfile) ||
          (authUser.uid === postOwnerProfile.uid && (
            <Grid item xs={12} className={classes.commentInputRow}>
              <OutlinedTextField
                label="Comment"
                placeholder=""
                onChangeHandler={onCommentChange}
                value={pendingComment}
              />
              <Tooltip title="Add Comment">
                <IconButton
                  component="label"
                  color="primary"
                  disabled={isCommentInvalid}
                  onClick={(): void => onCommentButtonClick()}
                >
                  <AddCommentIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          ))}
      </Grid>
    </Paper>
  );
};

PostItem.propTypes = {
  post: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  dateTime: PropTypes.string.isRequired,
  media: PropTypes.string.isRequired,
  pendingComment: PropTypes.string.isRequired,
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  onCommentButtonClick: PropTypes.func.isRequired,
  onCommentChange: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  isCommentsOpen: PropTypes.bool.isRequired,
  onCommentsOpenClick: PropTypes.func.isRequired,
  likes: PropTypes.arrayOf(PropTypes.any).isRequired,
  comments: PropTypes.arrayOf(PropTypes.any).isRequired,
  userProfile: PropTypes.any.isRequired,
  postOwnerProfile: PropTypes.any.isRequired,
};
