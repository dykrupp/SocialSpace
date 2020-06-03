import React, { useContext, useState, useEffect } from 'react';
import { Paper, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CommentIcon from '@material-ui/icons/Comment';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { FirebaseContext } from '../../../../Firebase/context';
import { AuthUserContext } from '../../../../AuthProvider/context';
import DeleteIcon from '@material-ui/icons/Delete';
import FavoriteIcon from '@material-ui/icons/Favorite';

interface PostProps {
  post: string;
  username: string;
  dateTime: string;
  media: string;
}

interface Comment {
  comment: string;
  dateTime: string;
  fullName: string;
}

interface Like {
  uid: string;
  fullName: string;
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
  commentRow: {
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
}));

const calcTimeSince = (milliseconds: number): string => {
  const seconds = Math.floor((new Date().valueOf() - milliseconds) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) return `${interval} years ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;

  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;

  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;

  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;

  return `${Math.floor(seconds)} seconds ago`;
};

const Post: React.FC<PostProps> = ({ post, username, dateTime, media }) => {
  const classes = useStyles();
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [likes, setLikes] = useState<Like[]>([]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setComment(event.target.value);
  };

  const onCommentButtonClick = (): void => {
    if (firebase && authUser) {
      const utcDateTime = new Date().toUTCString();
      firebase
        .comment(authUser.uid, dateTime, utcDateTime)
        .set({ comment, fullName: authUser.fullName });
      setComment('');
    }
  };

  const addLike = (): void => {
    if (firebase && authUser) {
      firebase
        .like(authUser.uid, dateTime, authUser.uid)
        .set({ fullName: authUser.fullName });
    }
  };

  const removeLike = (): void => {
    if (firebase && authUser) {
      firebase.like(authUser.uid, dateTime, authUser.uid).remove();
    }
  };

  const deletePost = (): void => {
    if (firebase && authUser) {
      if (media !== '') {
        firebase.storage
          .ref(`users/${authUser.uid}/posts/${dateTime}/media`)
          .delete()
          .then(() => firebase.post(authUser.uid, dateTime).remove());
      } else firebase.post(authUser.uid, dateTime).remove();
    }
  };

  const deleteComment = (commentDateTime: string): void => {
    if (firebase && authUser) {
      firebase.comment(authUser.uid, dateTime, commentDateTime).remove();
    }
  };

  useEffect(() => {
    if (firebase && authUser) {
      firebase.comments(authUser.uid, dateTime).on('value', (snapShot) => {
        const commentsObject = snapShot.val();
        if (commentsObject === null) {
          setComments([]);
          return;
        }

        const currentComments: Comment[] = Object.keys(commentsObject).map(
          (key) => ({
            ...commentsObject[key],
            dateTime: key,
          })
        );

        currentComments.sort((a, b) => {
          const secondDate = new Date(b.dateTime).valueOf();
          const firstDate = new Date(a.dateTime).valueOf();
          return secondDate - firstDate;
        });

        console.log(currentComments);
        setComments(currentComments);
      });
    }

    return function cleanup(): void {
      if (firebase && authUser) firebase.comments(authUser.uid, dateTime).off();
    };
  }, [firebase, authUser, dateTime]);

  useEffect(() => {
    if (firebase && authUser) {
      firebase.likes(authUser.uid, dateTime).on('value', (snapShot) => {
        const likesObject = snapShot.val();
        if (likesObject === null) {
          setLikes([]);
          return;
        }
        // console.log(likesObject);
        // setLikes(likesObject);
        const currentLikes: Like[] = Object.keys(likesObject).map((key) => ({
          ...likesObject[key],
          uid: key,
        }));

        console.log(currentLikes);

        setLikes(currentLikes);
      });
    }

    return function cleanup(): void {
      if (firebase && authUser) firebase.likes(authUser.uid, dateTime).off();
    };
  }, [firebase, authUser, dateTime]);

  const isInvalid = comment === '';
  const didCurrentUserLikePost = likes.find(
    (x) => x.fullName === authUser?.fullName
  );
  return (
    <Paper elevation={3} className={classes.paper}>
      <Grid container spacing={1}>
        <Grid item xs={12} className={classes.gridRow}>
          <p>{username}</p>
          <p style={{ marginLeft: '20px' }}>
            {calcTimeSince(Date.parse(dateTime))}
          </p>
          <Tooltip title="Delete Post">
            <IconButton component="label" onClick={deletePost}>
              <DeleteIcon color="primary" />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={12} className={classes.centeredRow}>
          <Typography variant="h6">{post}</Typography>
        </Grid>
        <Grid item xs={12} className={classes.centeredRow}>
          {media !== '' && (
            <img style={{ maxHeight: '250px' }} src={media} alt="postedMedia" />
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
                onClick={(): void =>
                  isCommentsOpen
                    ? setIsCommentsOpen(false)
                    : setIsCommentsOpen(true)
                }
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
            <Paper
              elevation={2}
              key={comment.dateTime}
              variant="outlined"
              className={classes.commentPaper}
            >
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
          ))}
        <Grid item xs={12} className={classes.commentRow}>
          <TextField
            id="standard-textarea"
            label="Add Comment"
            placeholder=""
            multiline
            onChange={onChange}
            value={comment}
            className={classes.commentInput}
          />
          <Button
            color="primary"
            variant="contained"
            disabled={isInvalid}
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

Post.propTypes = {
  post: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  dateTime: PropTypes.string.isRequired,
  media: PropTypes.string.isRequired,
};

export default Post;
