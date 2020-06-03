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
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { calcTimeSince } from '../../../../../utils/helperFunctions';
import { AuthUserContext } from '../../../../Authentication/AuthProvider/context';
import { PostProps, Like, Comment } from './index';

interface PostStyleProps extends PostProps {
  deletePost: () => void;
  addLike: () => void;
  removeLike: () => void;
  onCommentButtonClick: () => void;
  onCommentChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  deleteComment: (commentDateTime: string) => void;
  onCommentsOpenClick: () => void;
  isCommentsOpen: boolean;
  pendingComment: string;
  likes: Like[];
  comments: Comment[];
}

const useStyles = makeStyles(() => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
  },
  gridRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  iconButton: {
    marginLeft: '-15px',
  },
  centeredRow: {
    display: 'flex',
    justifyContent: 'center',
  },
  commentInputRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  commentInput: {
    width: '60%',
  },
  commentButton: {
    maxHeight: '50px',
    minHeight: '50px',
  },
  commentPaper: {
    width: '100%',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#e9ebee',
  },
  commentDiv: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  commentText: {
    textAlign: 'center',
  },
  marginLeft: {
    marginLeft: '20px',
  },
  imageMaxHeigt: {
    maxHeight: '250px',
  },
}));

export const PostStyle: React.FC<PostStyleProps> = ({
  post,
  username,
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
}) => {
  const classes = useStyles();
  const authUser = useContext(AuthUserContext);
  const isCommentInvalid = pendingComment === '';
  const didCurrentUserLikePost = likes.find(
    (x) => x.fullName === authUser?.fullName
  );
  return (
    <Paper elevation={3} className={classes.paper}>
      <Grid container spacing={1}>
        <HeaderRow
          dateTime={dateTime}
          username={username}
          deletePost={deletePost}
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
          {!didCurrentUserLikePost && (
            <Tooltip title="Like Post">
              <IconButton component="label" onClick={(): void => addLike()}>
                <Badge badgeContent={likes.length} color="secondary">
                  <FavoriteBorderIcon color="secondary" />
                </Badge>
              </IconButton>
            </Tooltip>
          )}
          {didCurrentUserLikePost && (
            <Tooltip title="Remove Like">
              <IconButton component="label" onClick={(): void => removeLike()}>
                <Badge badgeContent={likes.length} color="secondary">
                  <FavoriteIcon color="secondary" />
                </Badge>
              </IconButton>
            </Tooltip>
          )}
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
          comments.map((comment: Comment) => (
            <PaperComment
              key={comment.dateTime}
              comment={comment}
              deleteComment={deleteComment}
            />
          ))}
        <Grid item xs={12} className={classes.commentInputRow}>
          <TextField
            id="standard-textarea"
            label="Add Comment"
            placeholder=""
            multiline
            onChange={onCommentChange}
            value={pendingComment}
            className={classes.commentInput}
          />
          <Button
            color="primary"
            variant="contained"
            disabled={isCommentInvalid}
            onClick={onCommentButtonClick}
            className={classes.commentButton}
          >
            Submit Comment
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

PostStyle.propTypes = {
  post: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
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
};

interface HeaderRowProps {
  dateTime: string;
  username: string;
  deletePost: () => void;
}

const HeaderRow: React.FC<HeaderRowProps> = ({
  dateTime,
  username,
  deletePost,
}) => {
  const classes = useStyles();
  const authUser = useContext(AuthUserContext);

  return (
    <Grid item xs={12} className={classes.gridRow}>
      <p>{username}</p>
      <p className={classes.marginLeft}>
        {calcTimeSince(Date.parse(dateTime))}
      </p>
      {username === authUser?.fullName && (
        <Tooltip title="Delete Post">
          <IconButton component="label" onClick={deletePost}>
            <DeleteIcon color="primary" />
          </IconButton>
        </Tooltip>
      )}
    </Grid>
  );
};

HeaderRow.propTypes = {
  username: PropTypes.string.isRequired,
  dateTime: PropTypes.string.isRequired,
  deletePost: PropTypes.func.isRequired,
};

interface PaperCommentProps {
  comment: Comment;
  deleteComment: (commentDateTime: string) => void;
}

const PaperComment: React.FC<PaperCommentProps> = ({
  comment,
  deleteComment,
}) => {
  const classes = useStyles();
  const authUser = useContext(AuthUserContext);

  return (
    <Paper elevation={2} variant="outlined" className={classes.commentPaper}>
      <div className={classes.commentDiv}>
        <p>{comment.fullName}</p>
        <p>{calcTimeSince(Date.parse(comment.dateTime))}</p>
        {authUser?.fullName === comment.fullName && (
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

PaperComment.propTypes = {
  comment: PropTypes.any.isRequired,
  deleteComment: PropTypes.func.isRequired,
};
