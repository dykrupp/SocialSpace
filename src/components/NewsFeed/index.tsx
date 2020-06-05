import React, { useEffect, useContext, useState, useRef } from 'react';
import CreatePost from './CreatePost';
import { FirebaseContext } from '../Firebase/context';
import { AuthUserContext } from '../Authentication/AuthProvider/context';
import { Grid } from '@material-ui/core';
import Post from './Post';
import { Post as PostInterface } from '../../constants/interfaces';
import { addMediaToPosts, getSortedPosts } from '../../utils/helperFunctions';
import { IsLoading } from '../IsLoading';
import PropTypes from 'prop-types';

interface NewsFeedProps {
  isUserPostsOnly: boolean;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ isUserPostsOnly }) => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const numOfPosts = useRef(0);
  const [isLoading, setIsLoading] = useState(true);

  //TODO -> Introduce Paging here instead of grabbing ALL && only get data for users that are being 'followed'
  useEffect(() => {
    if (firebase && authUser && isUserPostsOnly) {
      firebase.posts(authUser.uid).on('value', async (snapShot) => {
        if (snapShot.val() === null) {
          setPosts([]);
          numOfPosts.current = 0;
          return;
        } else if (Object.keys(snapShot.val()).length === numOfPosts.current) {
          return; //Ignore event triggers from children
        }

        const currentPosts = await addMediaToPosts(
          firebase,
          authUser.uid,
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
      if (authUser) firebase?.posts(authUser.uid).off();
    };
  }, [firebase, authUser, isUserPostsOnly]);

  if (!authUser) return null;
  else if (isLoading) return <IsLoading />;
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <CreatePost />
      </Grid>
      {posts.map((post: PostInterface) => (
        <Grid item key={post.dateTime}>
          <Post
            post={post.post}
            username={authUser.fullName}
            dateTime={post.dateTime}
            media={post.media}
          />
        </Grid>
      ))}
    </Grid>
  );
};

NewsFeed.propTypes = {
  isUserPostsOnly: PropTypes.bool.isRequired,
};

export default NewsFeed;
