import React, { useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FirebaseContext } from '../../Firebase/context';
import { AuthUserContext } from '../../Authentication/AuthProvider/context';
import { PostStyle } from './PostStyle';
import { Comment, Like } from '../../../constants/interfaces';

export interface PostProps {
  post: string;
  username: string;
  userUID: string;
  dateTime: string;
  media: string;
}

const Post: React.FC<PostProps> = ({
  post,
  username,
  userUID,
  dateTime,
  media,
}) => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [likes, setLikes] = useState<Like[]>([]);
  const numOfComments = useRef(0);
  const numOfLikes = useRef(0);

  const onCommentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setComment(event.target.value);
  };

  const onCommentButtonClick = (): void => {
    if (firebase && authUser) {
      const utcDateTime = new Date().toUTCString();
      firebase
        .comment(userUID, dateTime, utcDateTime)
        .set({ comment, userUID: authUser.uid, fullName: authUser.fullName });
      setComment('');
    }
  };

  const onCommentsOpenClick = (): void => {
    isCommentsOpen ? setIsCommentsOpen(false) : setIsCommentsOpen(true);
  };

  const addLike = (): void => {
    if (firebase && authUser) {
      firebase
        .like(userUID, dateTime, authUser.uid)
        .set({ fullName: authUser.fullName });
    }
  };

  const removeLike = (): void => {
    if (firebase && authUser) {
      firebase.like(userUID, dateTime, authUser.uid).remove();
    }
  };

  const deletePost = (): void => {
    if (firebase && authUser) {
      if (media !== '') {
        firebase.storage
          .ref(`users/${userUID}/posts/${dateTime}/media`)
          .delete()
          .then(() => firebase.post(userUID, dateTime).remove());
      } else firebase.post(userUID, dateTime).remove();
    }
  };

  const deleteComment = (commentDateTime: string): void => {
    if (firebase && authUser) {
      firebase.comment(userUID, dateTime, commentDateTime).remove();
    }
  };

  useEffect(() => {
    if (firebase && authUser) {
      firebase.comments(userUID, dateTime).on('value', (snapShot) => {
        const commentsObject = snapShot.val();

        if (commentsObject === null) {
          setComments([]);
          numOfComments.current = 0;
          return;
        } else if (
          Object.keys(snapShot.val()).length === numOfComments.current
        ) {
          //Ignore unwanted triggers
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

        numOfComments.current = currentComments.length;
        setComments(currentComments);
      });
    }

    return function cleanup(): void {
      if (firebase && authUser) firebase.comments(userUID, dateTime).off();
    };
  }, [firebase, authUser, dateTime, userUID]);

  useEffect(() => {
    if (firebase && authUser) {
      firebase.likes(userUID, dateTime).on('value', (snapShot) => {
        const likesObject = snapShot.val();

        if (likesObject === null) {
          setLikes([]);
          numOfLikes.current = 0;
          return;
        } else if (Object.keys(snapShot.val()).length === numOfLikes.current) {
          //Ignore unwanted triggers
          return;
        }

        const currentLikes: Like[] = Object.keys(likesObject).map((key) => ({
          ...likesObject[key],
          userUID: key,
        }));

        numOfLikes.current = currentLikes.length;
        setLikes(currentLikes);
      });
    }

    return function cleanup(): void {
      if (firebase && authUser) firebase.likes(userUID, dateTime).off();
    };
  }, [firebase, authUser, dateTime, userUID]);

  return (
    <PostStyle
      username={username}
      post={post}
      dateTime={dateTime}
      media={media}
      deletePost={deletePost}
      deleteComment={deleteComment}
      pendingComment={comment}
      addLike={addLike}
      onCommentButtonClick={onCommentButtonClick}
      onCommentChange={onCommentChange}
      onCommentsOpenClick={onCommentsOpenClick}
      isCommentsOpen={isCommentsOpen}
      comments={comments}
      likes={likes}
      removeLike={removeLike}
      userUID={userUID}
    />
  );
};

Post.propTypes = {
  post: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  userUID: PropTypes.string.isRequired,
  dateTime: PropTypes.string.isRequired,
  media: PropTypes.string.isRequired,
};

export default Post;
