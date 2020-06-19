import React, { useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FirebaseContext } from '../../Firebase/context';
import { AuthUserContext } from '../../Authentication/AuthProvider/context';
import { PostItem } from './PostItem';
import {
  Comment,
  Like,
  User,
  UserProfileUID,
} from '../../../constants/interfaces';

export interface PostProps {
  post: string;
  parentKey: string;
  createdByUID: string;
  dateTime: string;
  media: string;
}

const Post: React.FC<PostProps> = ({
  post,
  parentKey,
  createdByUID,
  dateTime,
  media,
}) => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [likes, setLikes] = useState<Like[]>([]);
  const [postUserProfile, setPostUserProfile] = useState<UserProfileUID>();
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
      firebase.comment(parentKey, dateTime, utcDateTime).set({
        comment,
        userUID: authUser.uid,
      });
      setComment('');
    }
  };

  const onCommentsOpenClick = (): void => {
    isCommentsOpen ? setIsCommentsOpen(false) : setIsCommentsOpen(true);
  };

  const addLike = (): void => {
    if (firebase && authUser) {
      firebase.likes(parentKey, dateTime).push({ userUID: authUser.uid });
    }
  };

  const removeLike = (): void => {
    if (firebase && authUser) {
      const key = likes.filter((x) => x.userUID === authUser.uid)[0].key;
      firebase.like(parentKey, dateTime, key).remove();
    }
  };

  const deletePost = (): void => {
    if (firebase) {
      if (media !== '') {
        firebase.storage
          .ref(`users/${parentKey}/posts/${dateTime}/media`)
          .delete()
          .then(() => firebase.post(parentKey, dateTime).remove());
      } else firebase.post(parentKey, dateTime).remove();
    }
  };

  const deleteComment = (commentDateTime: string): void => {
    if (firebase)
      firebase.comment(parentKey, dateTime, commentDateTime).remove();
  };

  useEffect(() => {
    if (firebase) {
      firebase.user(createdByUID).once('value', (snapShot) => {
        setPostUserProfile(() => {
          return {
            ...(snapShot.val() as User),
            uid: createdByUID,
          } as UserProfileUID;
        });
      });
    }
  }, [firebase, createdByUID]);

  useEffect(() => {
    if (firebase) {
      firebase.comments(parentKey, dateTime).on('value', (snapShot) => {
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
      firebase?.comments(parentKey, dateTime).off();
    };
  }, [firebase, dateTime, parentKey]);

  useEffect(() => {
    if (firebase) {
      firebase.likes(parentKey, dateTime).on('value', (snapShot) => {
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
          key: key,
        }));

        numOfLikes.current = currentLikes.length;
        setLikes(currentLikes);
      });
    }

    return function cleanup(): void {
      firebase?.likes(parentKey, dateTime).off();
    };
  }, [firebase, dateTime, parentKey]);

  if (!postUserProfile) return null;
  return (
    <PostItem
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
      userProfile={postUserProfile}
    />
  );
};

Post.propTypes = {
  post: PropTypes.string.isRequired,
  createdByUID: PropTypes.string.isRequired,
  dateTime: PropTypes.string.isRequired,
  media: PropTypes.string.isRequired,
  parentKey: PropTypes.string.isRequired,
};

export default Post;
