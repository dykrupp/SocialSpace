/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useState, useRef } from 'react';
import CreatePost from './CreatePost';
import { FirebaseContext } from '../Firebase/context';
import { Grid } from '@material-ui/core';
import { IsLoading } from '../IsLoading';
import PropTypes from 'prop-types';
import { AuthUserContext } from '../Authentication/AuthProvider/context';
import Post from './Post';
import { Following } from '../../constants/interfaces';
import {
  Post as PostInterface,
  UserProfileUID,
} from '../../constants/interfaces';
import {
  addMediaUrl,
  getSortedPosts,
  convertToPosts,
} from '../../utils/helperFunctions';

interface NewsFeedProps {
  userProfile: UserProfileUID | null;
}

const LimitNewsFeedBy = 10;

const NewsFeed: React.FC<NewsFeedProps> = ({ userProfile }) => {
  const firebase = useContext(FirebaseContext);
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const previousPosts = useRef<PostInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const authUser = useContext(AuthUserContext);
  const feedUID = userProfile ? userProfile.uid : authUser ? authUser.uid : '';

  const areFriends = (userProfile: UserProfileUID): boolean => {
    return authUser && userProfile.followers && userProfile.followings
      ? userProfile.followings.filter((x) => x.userUID === authUser.uid)
          .length !== 0 &&
          userProfile.followers.filter((x) => x.userUID === authUser.uid)
            .length !== 0
      : false;
  };

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

  const resetPosts = (): void => {
    previousPosts.current = [];
    setPosts([]);
    setIsLoading(false);
  };

  const getFollowUIDS = (
    snapShot: firebase.database.DataSnapshot
  ): string[] => {
    const currentFollowings = snapShot.val();
    const followingArr: Following[] = Object.keys(currentFollowings).map(
      (key) => ({
        ...currentFollowings[key],
      })
    );
    return followingArr.map((x) => x.userUID);
  };

  const addNewsFeedPost = async (
    feedUID: string,
    currentUserPosts: PostInterface[]
  ): Promise<void> => {
    if (firebase) {
      const sortedPosts = await addMediaUrl(
        firebase,
        feedUID,
        getSortedPosts(currentUserPosts)
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
    }
  };

  const removeNewsFeedPost = (
    previousUserPosts: PostInterface[],
    currentUserPosts: PostInterface[]
  ): void => {
    const postToRemove = previousUserPosts.filter((previousPost) =>
      currentUserPosts.some(
        (currentPost) =>
          currentPost.post !== previousPost.post &&
          currentPost.dateTime !== previousPost.dateTime
      )
    )[0];

    previousPosts.current = previousPosts.current.filter(
      (post) => post !== postToRemove
    );

    setPosts(() => previousPosts.current);
  };

  const setNewsFeedPosts = (feedUIDS: string[]): void => {
    if (firebase && authUser) {
      let postsCounter = 1;

      for (const feedUID of feedUIDS) {
        firebase
          .posts(feedUID)
          .limitToLast(LimitNewsFeedBy)
          // eslint-disable-next-line
          .on('value', async (snapShot) => {
            if (snapShot.val() !== null) {
              const currentUserPosts = convertToPosts(snapShot);
              const previousUserPosts = previousPosts.current?.filter(
                (post) => post.createdByUID === feedUID
              );

              if (
                !containsUniquePost(snapShot) &&
                previousUserPosts.length !== 0 &&
                currentUserPosts.length === previousUserPosts.length
              ) {
                return; //Ignore event triggers from children (comments/likes)
              } else if (
                previousUserPosts &&
                currentUserPosts.length === previousUserPosts.length - 1
              ) {
                removeNewsFeedPost(previousUserPosts, currentUserPosts);
              } else {
                await addNewsFeedPost(feedUID, currentUserPosts);
              }
            } else if (previousPosts.current.length >= 1) {
              //handle case where last post from feedUID is removed
              previousPosts.current = previousPosts.current.filter(
                (post) => post.createdByUID !== feedUID
              );

              setPosts(() => previousPosts.current);
            }

            if (
              postsCounter === feedUIDS.length &&
              previousPosts.current.length !== 0
            ) {
              setIsLoading(false);
            } else if (
              postsCounter >= feedUIDS.length &&
              previousPosts.current.length === 0
            ) {
              resetPosts();
            }

            postsCounter++;
          });
      }
    }
  };

  const setProfilePosts = async (
    snapShot: firebase.database.DataSnapshot
  ): Promise<void> => {
    if (firebase) {
      if (snapShot.val() === null) resetPosts();
      else if (
        containsUniquePost(snapShot) ||
        Object.keys(snapShot.val()).length !== previousPosts.current?.length
      ) {
        const postsWithMediaURL = await addMediaUrl(
          firebase,
          feedUID,
          getSortedPosts(convertToPosts(snapShot))
        );

        if (postsWithMediaURL) {
          previousPosts.current = postsWithMediaURL;
          setPosts(postsWithMediaURL);
          setIsLoading(false);
        }
      }
    }
  };

  //TODO -> Introduce Paging here so we don't get all posts in one large chunk
  useEffect(() => {
    if (firebase && userProfile) {
      firebase.posts(feedUID).on('value', async (snapShot) => {
        setProfilePosts(snapShot);
      });
    }

    return function cleanup(): void {
      firebase?.posts(feedUID).off();
    };
  }, [firebase, userProfile, feedUID]);

  //TODO -> Introduce Paging here so we don't get all posts in one large chunk
  useEffect(() => {
    let feedUIDS: string[] = [];

    if (firebase && !userProfile && authUser) {
      firebase.followings(feedUID).on('value', (followSnapShot) => {
        feedUIDS = //add current user to feedUIDS
          followSnapShot.val() === null
            ? new Array(authUser.uid)
            : getFollowUIDS(followSnapShot).concat(authUser.uid);

        setNewsFeedPosts(feedUIDS);
      });
    }

    return function cleanup(): void {
      firebase?.followings(feedUID).off();
      feedUIDS.forEach((feedUID) => {
        firebase?.posts(feedUID).off();
      });
    };
  }, [firebase, userProfile, authUser, feedUID]);

  const isAuthUsersFeed = authUser?.uid === feedUID;

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
        {!isAuthUsersFeed && userProfile && areFriends(userProfile) && (
          <CreatePost createdByUserUID={authUser.uid} postUserUID={feedUID} />
        )}
      </Grid>
      {posts.map((post: PostInterface) => (
        <Grid item key={post.dateTime}>
          <Post
            post={post.post}
            dateTime={post.dateTime}
            media={post.media}
            createdByUID={post.createdByUID}
          />
        </Grid>
      ))}
    </Grid>
  );
};

NewsFeed.propTypes = {
  userProfile: PropTypes.any,
};

export default NewsFeed;
