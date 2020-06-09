/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useState, useRef } from 'react';
import CreatePost from './CreatePost';
import { FirebaseContext } from '../Firebase/context';
import { Grid } from '@material-ui/core';
import { Post as PostInterface } from '../../constants/interfaces';
import { addMediaToPosts, getSortedPosts } from '../../utils/helperFunctions';
import { IsLoading } from '../IsLoading';
import PropTypes from 'prop-types';
import { AuthUserContext } from '../Authentication/AuthProvider/context';
import Post from './Post';

interface NewsFeedProps {
  isProfileFeed: boolean;
  userUID: string;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ isProfileFeed, userUID }) => {
  const firebase = useContext(FirebaseContext);
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const authUser = useContext(AuthUserContext);
  const numOfPosts = useRef(0);

  //TODO -> Introduce Paging here instead of grabbing ALL && only get data for users that are being 'followed'
  useEffect(() => {
    if (firebase && isProfileFeed) {
      firebase.posts(userUID).on('value', async (snapShot) => {
        const postStrArr = posts.map((post) => post.post);

        if (snapShot.val() === null) {
          numOfPosts.current = 0;
          setPosts([]);
          setIsLoading(false);
          return;
        } else if (
          Object.keys(snapShot.val()).length === numOfPosts.current &&
          postStrArr.includes((snapShot.val() as PostInterface).post)
        ) {
          return; //Ignore event triggers from children
        }

        const currentPosts = await addMediaToPosts(
          firebase,
          userUID,
          getSortedPosts(snapShot.val())
        );

        if (currentPosts) {
          numOfPosts.current = currentPosts.length;
          setPosts(currentPosts);
          setIsLoading(false);
        }
      });
    }

    return function cleanup(): void {
      firebase?.posts(userUID).off();
    };
  }, [firebase, isProfileFeed, userUID]);

  const isAuthUsersFeed = authUser?.uid === userUID;

  if (isLoading) return <IsLoading />;
  else if (!authUser || !firebase) return null;
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        {isAuthUsersFeed && (
          <CreatePost
            createdByUserUID={authUser.uid}
            postUserUID={authUser.uid}
          />
        )}
        {!isAuthUsersFeed && (
          <CreatePost createdByUserUID={authUser.uid} postUserUID={userUID} />
        )}
      </Grid>
      {posts.map((post: PostInterface) => (
        <Grid item key={post.dateTime}>
          <Post
            post={post.post}
            username={post.createdByName}
            dateTime={post.dateTime}
            media={post.media}
          />
        </Grid>
      ))}
    </Grid>
  );
};

NewsFeed.propTypes = {
  isProfileFeed: PropTypes.bool.isRequired,
  userUID: PropTypes.string.isRequired,
};

export default NewsFeed;
