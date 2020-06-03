/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import React, { useEffect, useContext, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CreatePost from './CreatePost';
import { FirebaseContext } from '../../../Firebase/context';
import { AuthUserContext } from '../../../Authentication/AuthProvider/context';
import { Grid } from '@material-ui/core';
import Post from './Post';
import * as Collections from 'typescript-collections';

interface Post {
  post: string;
  dateTime: string;
  media: string;
}

const useStyles = makeStyles(() => ({
  root: {
    width: '500px',
    margin: '0 auto',
  },
}));

const getSortedPosts = (snapShot: firebase.database.DataSnapshot): Post[] => {
  const postsObject = snapShot.val();
  const currentPosts: Post[] = Object.keys(postsObject).map((key) => ({
    ...postsObject[key],
    dateTime: key,
    media: '',
  }));
  return currentPosts.sort((a, b) => {
    const secondDate: any = new Date(b.dateTime);
    const firstDate: any = new Date(a.dateTime);
    return secondDate - firstDate;
  });
};

const NewsFeed: React.FC = () => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const classes = useStyles();
  const numOfPosts = useRef(0);

  //TODO -> Introduce Paging here instead of grabbing ALL && only get data for users that are being 'followed'
  useEffect(() => {
    if (firebase && authUser) {
      firebase.posts(authUser.uid).on('value', (snapShot) => {
        if (snapShot.val() === null) {
          setPosts([]);
          numOfPosts.current = 0;
          return;
        } else if (Object.keys(snapShot.val()).length === numOfPosts.current) {
          //Ignore event triggers from children
          return;
        }

        const sortedPosts = getSortedPosts(snapShot);
        const storageRef = firebase.storage.ref(`users/${authUser.uid}/posts/`);

        //grab all associated media relative to the uid before setting posts state
        storageRef.listAll().then((list) => {
          new Promise<Collections.Dictionary<string, any>>((resolve) => {
            const dict = new Collections.Dictionary<string, string>();
            if (list.prefixes.length === 0) resolve(dict);
            list.prefixes.forEach((prefix, index, array) => {
              prefix
                .child('media')
                .getDownloadURL()
                .then((url: string) => {
                  dict.setValue(prefix.name, url);
                  if (dict.size() === array.length) {
                    resolve(dict);
                  }
                });
            });
          }).then((dict) => {
            const postsWithMedia = sortedPosts.map((post) => {
              if (dict.keys().includes(post.dateTime)) {
                return { ...post, media: dict.getValue(post.dateTime) };
              } else return post;
            });
            numOfPosts.current = postsWithMedia.length;
            setPosts(postsWithMedia);
          });
        });
      });
    }
    return function cleanup(): void {
      if (firebase && authUser) {
        firebase.posts(authUser.uid).off();
      }
    };
  }, [firebase, authUser]);

  if (!authUser) return null;
  return (
    <Grid container direction="column" spacing={2} className={classes.root}>
      <Grid item>
        <CreatePost />
      </Grid>
      {posts.map((post: Post) => (
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
