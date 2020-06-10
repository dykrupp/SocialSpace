/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useState, useRef } from 'react';
import CreatePost from './CreatePost';
import { FirebaseContext } from '../Firebase/context';
import { Grid } from '@material-ui/core';
import { Post as PostInterface } from '../../constants/interfaces';
import { IsLoading } from '../IsLoading';
import PropTypes from 'prop-types';
import { AuthUserContext } from '../Authentication/AuthProvider/context';
import Post from './Post';
import {
  addMediaUrl,
  getSortedPosts,
  convertToPosts,
} from '../../utils/helperFunctions';

interface NewsFeedProps {
  isProfileFeed: boolean;
  userUID: string;
}

const LimitNewsFeedBy = 10;

const NewsFeed: React.FC<NewsFeedProps> = ({ isProfileFeed, userUID }) => {
  const firebase = useContext(FirebaseContext);
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const previousPosts = useRef<PostInterface[]>();
  const [isLoading, setIsLoading] = useState(true);
  const authUser = useContext(AuthUserContext);

  const containsUniquePost = (
    snapShot: firebase.database.DataSnapshot
  ): boolean => {
    if (previousPosts.current) {
      const postStrArr = previousPosts.current.map((post) => post.post);
      return (
        convertToPosts(snapShot).filter((element) => {
          return postStrArr.indexOf(element.post) === -1;
        }).length !== 0
      );
    } else return true;
  };

  const setProfilePosts = async (
    snapShot: firebase.database.DataSnapshot
  ): Promise<void> => {
    if (firebase) {
      if (snapShot.val() === null) {
        previousPosts.current = [];
        setPosts([]);
        setIsLoading(false);
        return;
      } else if (!containsUniquePost(snapShot)) return; //Ignore event triggers from children (comments/likes)

      const postsWithMediaURL = await addMediaUrl(
        firebase,
        userUID,
        getSortedPosts(convertToPosts(snapShot))
      );

      if (postsWithMediaURL) {
        previousPosts.current = postsWithMediaURL;
        setPosts(postsWithMediaURL);
        setIsLoading(false);
      }
    }
  };

  const setNewsFeedPosts = (feedUIDS: string[]): void => {
    if (firebase && authUser) {
      feedUIDS.forEach((feedUID, index, array) => {
        firebase
          .posts(feedUID)
          .limitToLast(LimitNewsFeedBy)
          .on('value', async (snapShot) => {
            if (snapShot.val() !== null) {
              if (!containsUniquePost(snapShot)) return; //Ignore event triggers from children (comments/likes)

              const sortedPosts = await addMediaUrl(
                firebase,
                userUID,
                getSortedPosts(convertToPosts(snapShot))
              );

              if (sortedPosts) {
                setPosts((posts) => {
                  const uniqueArr = getSortedPosts(
                    posts
                      .concat(sortedPosts)
                      .filter(
                        (item, index, array) =>
                          index ===
                          array.findIndex(
                            (element) => element.dateTime === item.dateTime
                          )
                      )
                  );
                  previousPosts.current = uniqueArr;
                  return uniqueArr;
                });
              }

              if (index === array.length - 1) setIsLoading(false);
            } else if (
              !previousPosts.current ||
              previousPosts.current.length === 1
            ) {
              //handle case where there are no posts
              previousPosts.current = [];
              setPosts([]);
              setIsLoading(false);
            }
          });
      });
    }
  };

  //TODO -> Introduce Paging here so we don't get all posts in one large chunk
  useEffect(() => {
    if (firebase && isProfileFeed) {
      firebase.posts(userUID).on('value', async (snapShot) => {
        setProfilePosts(snapShot);
      });
    }

    return function cleanup(): void {
      firebase?.posts(userUID).off();
    };
  }, [firebase, isProfileFeed, userUID]);

  //TODO -> Introduce Paging here so we don't get all posts in one large chunk
  useEffect(() => {
    let feedUIDS = [''];

    if (firebase && !isProfileFeed && authUser) {
      firebase
        .follows(userUID)
        .once('value')
        .then((followSnapShot) => {
          feedUIDS = //add current user to feedUIDS
            followSnapShot.val() === null
              ? new Array(authUser.uid)
              : Object.keys(followSnapShot.val()).concat(authUser.uid);

          setNewsFeedPosts(feedUIDS);
        });
    }

    return function cleanup(): void {
      feedUIDS.forEach((feedUID) => {
        firebase?.posts(feedUID).off();
      });
    };
  }, [firebase, isProfileFeed, authUser, userUID]);

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
            userUID={userUID}
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
