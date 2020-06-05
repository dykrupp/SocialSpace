import React, { useEffect, useContext, useState, useRef } from 'react';
import CreatePost from './CreatePost';
import { FirebaseContext } from '../Firebase/context';
import { Grid } from '@material-ui/core';
import Post from './Post';
import { Post as PostInterface } from '../../constants/interfaces';
import { addMediaToPosts, getSortedPosts } from '../../utils/helperFunctions';
import { IsLoading } from '../IsLoading';
import PropTypes from 'prop-types';
import { AuthUserContext } from '../Authentication/AuthProvider/context';

interface NewsFeedProps {
  isUserPostsOnly: boolean;
  userUID: string;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ isUserPostsOnly, userUID }) => {
  const firebase = useContext(FirebaseContext);
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const numOfPosts = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const authUser = useContext(AuthUserContext);

  //TODO -> Introduce Paging here instead of grabbing ALL && only get data for users that are being 'followed'
  useEffect(() => {
    if (firebase && isUserPostsOnly) {
      firebase.posts(userUID).on('value', async (snapShot) => {
        if (snapShot.val() === null) {
          numOfPosts.current = 0;
          setPosts([]);
          setIsLoading(false);
          return;
        } else if (Object.keys(snapShot.val()).length === numOfPosts.current) {
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
  }, [firebase, isUserPostsOnly, userUID]);

  if (isLoading) return <IsLoading />;
  else if (!authUser) return null;
  //TODO -> Replace username with actual post username when implementing the dynamic news feed
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
  userUID: PropTypes.string.isRequired,
};

export default NewsFeed;
