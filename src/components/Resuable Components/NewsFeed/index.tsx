import React, { useEffect, useContext, useState, useRef } from 'react';
import CreatePost from './CreatePost';
import { FirebaseContext } from '../../Firebase/context';
import { Grid } from '@material-ui/core';
import { IsLoading } from '../IsLoading';
import PropTypes from 'prop-types';
import { AuthUserContext } from '../../Authentication/AuthProvider/context';
import Post from './Post';
import { Following } from '../../../constants/interfaces';
import {
  Post as PostInterface,
  UserProfileUID,
} from '../../../constants/interfaces';
import {
  addMediaUrl,
  getSortedPosts,
  convertToPosts,
  areFriends,
} from '../../../utils/helperFunctions';

interface NewsFeedProps {
  userProfile: UserProfileUID | null;
  users: UserProfileUID[];
}

const LimitNewsFeedBy = 10;

const NewsFeed: React.FC<NewsFeedProps> = ({ userProfile, users }) => {
  const firebase = useContext(FirebaseContext);
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const previousPosts = useRef<PostInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const authUser = useContext(AuthUserContext);
  const feedUID = userProfile ? userProfile.uid : authUser ? authUser.uid : '';

  const containsUniquePost = (
    snapShot: firebase.database.DataSnapshot,
    feedUID: string
  ): boolean => {
    if (previousPosts.current) {
      const postStrArr = previousPosts.current.map((post) => post.post);
      return (
        convertToPosts(snapShot, feedUID).filter((element) => {
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

  //TODO -> Introduce Paging here so we don't get all posts in one large chunk
  useEffect(() => {
    const setProfilePosts = async (
      snapShot: firebase.database.DataSnapshot
    ): Promise<void> => {
      if (firebase) {
        if (snapShot.val() === null) resetPosts();
        else if (
          containsUniquePost(snapShot, feedUID) ||
          Object.keys(snapShot.val()).length !== previousPosts.current?.length
        ) {
          const postsWithMediaURL = await addMediaUrl(
            firebase,
            feedUID,
            getSortedPosts(convertToPosts(snapShot, feedUID))
          );

          if (postsWithMediaURL) {
            previousPosts.current = postsWithMediaURL;
            setPosts(postsWithMediaURL);
            setIsLoading(false);
          }
        }
      }
    };

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
                const currentUserPosts = convertToPosts(snapShot, feedUID);

                const previousUserPosts = previousPosts.current?.filter(
                  (post) => post.createdByUID === feedUID
                );

                if (
                  !containsUniquePost(snapShot, feedUID) &&
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
              } else if (previousPosts.current.length > 1) {
                //handle case where last post from feedUID is removed
                previousPosts.current = previousPosts.current.filter(
                  (post) => post.createdByUID !== feedUID
                );

                setPosts(() => previousPosts.current);
              } else if (previousPosts.current.length === 1) {
                resetPosts();
              }

              if (postsCounter === feedUIDS.length) {
                setIsLoading(false);
              }

              postsCounter++;
            });
        }
      }
    };

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

  if (isLoading) return <IsLoading text="Loading" />;
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
        {!isAuthUsersFeed &&
          userProfile &&
          areFriends(authUser, userProfile) && (
            <CreatePost createdByUserUID={authUser.uid} postUserUID={feedUID} />
          )}
      </Grid>
      {posts.map((post: PostInterface) => (
        <Grid item key={post.dateTime}>
          <Post post={post} users={users} />
        </Grid>
      ))}
    </Grid>
  );
};

NewsFeed.propTypes = {
  userProfile: PropTypes.any,
  users: PropTypes.array.isRequired,
};

export default NewsFeed;
