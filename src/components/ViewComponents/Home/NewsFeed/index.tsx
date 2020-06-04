import React, { useEffect, useContext, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CreatePost from './CreatePost';
import { FirebaseContext } from '../../../Firebase/context';
import { AuthUserContext } from '../../../Authentication/AuthProvider/context';
import { Grid } from '@material-ui/core';
import Post from './Post';
import { Post as PostInterface } from '../../../../constants/interfaces';
import {
  addMediaToPosts,
  getSortedPosts,
} from '../../../../utils/helperFunctions';
import { IsLoading } from '../../../IsLoading';

const useStyles = makeStyles(() => ({
  root: {
    width: '500px',
    margin: '0 auto',
  },
}));

const NewsFeed: React.FC = () => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const classes = useStyles();
  const numOfPosts = useRef(0);
  const [isLoading, setIsLoading] = useState(true);

  //TODO -> Introduce Paging here instead of grabbing ALL && only get data for users that are being 'followed'
  useEffect(() => {
    if (firebase && authUser) {
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
      if (firebase && authUser) {
        firebase.posts(authUser.uid).off();
      }
    };
  }, [firebase, authUser]);

  if (!authUser) return null;
  else if (isLoading) return <IsLoading />;
  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
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

export default NewsFeed;
