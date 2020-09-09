import React, { useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FirebaseContext } from '../../../Firebase/context';
import { AuthUserContext } from '../../../Authentication/AuthProvider/context';
import { PostItem } from './PostItem';
import {
  Comment,
  Like,
  UserProfileUID,
  Post as PostInterface,
} from '../../../../constants/interfaces';

export interface PostProps {
  post: PostInterface;
  users: UserProfileUID[];
}

const Post: React.FC<PostProps> = ({ post: userPost, users }) => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [likes, setLikes] = useState<Like[]>([]);
  const numOfComments = useRef(0);
  const numOfLikes = useRef(0);
  const postProfile = users.find((x) => x.uid === userPost.createdByUID);
  const postOwnerProfile = users.find((x) => x.uid === userPost.userUID);
  const { post, dateTime, media, userUID, postUID } = userPost;

  const onCommentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setComment(event.target.value);
  };

  const onCommentButtonClick = (): void => {
    if (firebase && authUser) {
      firebase.comments(userUID, postUID).push({
        comment,
        userUID: authUser.uid,
        dateTime: new Date().toUTCString(),
      });
      setComment('');
    }
  };

  const onCommentsOpenClick = (): void => {
    isCommentsOpen ? setIsCommentsOpen(false) : setIsCommentsOpen(true);
  };

  const addLike = (): void => {
    if (firebase && authUser) {
      firebase.likes(userUID, postUID).push({ userUID: authUser.uid });
    }
  };

  const removeLike = (): void => {
    if (firebase && authUser) {
      const likeUID = likes.filter((x) => x.userUID === authUser.uid)[0]
        .likeUID;
      firebase.like(userUID, postUID, likeUID).remove();
    }
  };

  const deletePost = (): void => {
    if (firebase) {
      firebase.post(userUID, postUID).remove();

      if (media !== '') {
        firebase.storage
          .ref(`users/${userUID}/posts/${postUID}/media`)
          .delete();
      }
    }
  };

  const deleteComment = (comment: Comment): void => {
    if (firebase)
      firebase.comment(userUID, postUID, comment.commentUID).remove();
  };

  useEffect(() => {
    if (firebase) {
      firebase.comments(userUID, postUID).on('value', (snapShot) => {
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
            commentUID: key,
          })
        );

        currentComments.sort((a, b) => {
          const secondDate = new Date(b.dateTime).valueOf();
          const firstDate = new Date(a.dateTime).valueOf();
          return firstDate - secondDate;
        });

        numOfComments.current = currentComments.length;
        setComments(currentComments);
      });
    }

    return function cleanup(): void {
      firebase?.comments(userUID, postUID).off();
    };
  }, [firebase, postUID, userUID]);

  useEffect(() => {
    if (firebase) {
      firebase.likes(userUID, postUID).on('value', (snapShot) => {
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
          likeUID: key,
        }));

        numOfLikes.current = currentLikes.length;
        setLikes(currentLikes);
      });
    }

    return function cleanup(): void {
      firebase?.likes(userUID, postUID).off();
    };
  }, [firebase, postUID, userUID]);

  if (!postProfile || !postOwnerProfile) return null;
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
      users={users}
      userProfile={postProfile}
      postOwnerProfile={postOwnerProfile}
    />
  );
};

Post.propTypes = {
  post: PropTypes.any.isRequired,
  users: PropTypes.array.isRequired,
};

export default Post;
