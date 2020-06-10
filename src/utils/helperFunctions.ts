/* eslint-disable @typescript-eslint/no-explicit-any */
import Firebase from '../components/Firebase/index';
import * as Collections from 'typescript-collections';
import { Post } from '../constants/interfaces';

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

export const getSortedPosts = (posts: Post[]): Post[] => {
  return posts.sort((a, b) => {
    const secondDate = new Date(b.dateTime).valueOf();
    const firstDate = new Date(a.dateTime).valueOf();
    return secondDate - firstDate;
  });
};

export const convertToPosts = (
  snapShot: firebase.database.DataSnapshot
): Post[] => {
  const postsObject = snapShot.val();
  const currentPosts: Post[] = Object.keys(postsObject).map((key) => ({
    ...postsObject[key],
    dateTime: key,
    media: '',
  }));
  return currentPosts;
};

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
        if (dict.keys().includes(post.dateTime)) {
          return { ...post, media: dict.getValue(post.dateTime) };
        } else return post;
      });
    });
};

export const getFirstName = (fullName: string): string =>
  fullName.split(' ')[0];
