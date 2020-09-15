/* eslint-disable @typescript-eslint/no-explicit-any */
import Firebase from '../components/Firebase';
import * as Collections from 'typescript-collections';
import { Post, UserProfileUID, ChatUID } from './constants/interfaces';
import { AuthUser } from '../components/Authentication/AuthProvider/context';

export const calcTimeSince = (milliseconds: number): string => {
  const seconds = Math.floor((new Date().valueOf() - milliseconds) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) return `${interval} years ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;

  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;

  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;

  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;

  return `${Math.floor(seconds)} seconds ago`;
};

export const getSortedObjects = (objects: any[]): any[] => {
  return objects.sort((a, b) => {
    const secondDate = new Date(b.dateTime).valueOf();
    const firstDate = new Date(a.dateTime).valueOf();
    return secondDate - firstDate;
  });
};

export const convertToPosts = (
  snapShot: firebase.database.DataSnapshot,
  parentUID: string
): Post[] => {
  const postsObject = snapShot.val();
  const currentPosts: Post[] = Object.keys(postsObject).map((key) => ({
    ...postsObject[key],
    media: '',
    userUID: parentUID,
    postUID: key,
  }));
  return currentPosts;
};

export const convertToUserProfile = (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  object: any,
  userUID: string
): UserProfileUID => {
  const userProfile: UserProfileUID = { ...object, uid: userUID };

  if (userProfile.followers) {
    userProfile.followers = Object.keys(userProfile.followers).map((key) => ({
      ...(userProfile.followers as any)[key],
    }));
  }

  if (userProfile.followings) {
    userProfile.followings = Object.keys(userProfile.followings).map((key) => ({
      ...(userProfile.followings as any)[key],
    }));
  }

  return userProfile;
};

//TODO -> This is the call in particular that is responsible for doing all these reads
export const addMediaUrl = async (
  firebase: Firebase,
  userUID: string,
  posts: Post[]
): Promise<Post[] | null> => {
  const storageRef = firebase.storage.ref(`users/${userUID}/posts/`);

  return await storageRef
    .listAll()
    .then(async (list) => {
      return await new Promise<Collections.Dictionary<string, any>>(
        (resolve) => {
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
        }
      );
    })
    .then((dict) => {
      return posts.map((post) => {
        if (dict.keys().includes(post.postUID)) {
          return { ...post, media: dict.getValue(post.postUID) };
        } else return post;
      });
    });
};

export const areFriends = (
  authUser: AuthUser,
  userProfile: UserProfileUID
): boolean => {
  return authUser && userProfile.followers && userProfile.followings
    ? userProfile.followings.filter((x) => x.userUID === authUser.uid)
        .length !== 0 &&
        userProfile.followers.filter((x) => x.userUID === authUser.uid)
          .length !== 0
    : false;
};

export const containsUnreadMessages = (
  chatUID: ChatUID,
  authUserUID: string
): boolean => {
  const currentUserUID = chatUID.userUIDS.find(
    (userUID) => userUID.userUID === authUserUID
  );

  if (
    currentUserUID &&
    chatUID.lastWriteUID !== authUserUID &&
    new Date(currentUserUID?.lastSeen) < new Date(chatUID.lastWriteTime)
  ) {
    return true;
  } else return false;
};

export const getFirstName = (fullName: string): string =>
  fullName.split(' ')[0];
