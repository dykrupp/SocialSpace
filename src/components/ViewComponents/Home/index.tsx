import React, { useEffect, useContext, useState } from 'react';
import CreatePost from './CreatePost';
import { FirebaseContext } from '../../Firebase/context';
import { AuthUserContext } from '../../AuthProvider/context';
import { Grid } from '@material-ui/core';
import Post from './Post';

interface Post {
  post: string;
  dateTime: string;
}

// interface User {
//   birthday: string;
//   email: string;
//   fullName: string;
//   gender: string;
//   uid: string;
//   posts: {
//     [key: string]: Post;
//   };
// }

const Home: React.FC = () => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (firebase && authUser) {
      firebase.posts(authUser.uid).on('value', (snapShot) => {
        const postsObject = snapShot.val();

        const userList: Post[] = Object.keys(postsObject).map((key) => ({
          ...postsObject[key],
          dateTime: key,
        }));

        setPosts(userList);
      });
    }
  }, [firebase, authUser]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <CreatePost />
      </Grid>
      {posts.map((post: Post) => (
        <Grid item xs={12} key={post.dateTime}>
          <Post post={post.post} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Home;
