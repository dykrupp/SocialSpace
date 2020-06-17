export interface User {
  fullName: string;
  email: string;
  birthday: string;
  gender: string;
  followings: Following[];
  followers: Follower[];
  profilePicURL: string;
}

export interface UserUID extends User {
  uid: string;
}

interface Following {
  userUID: string;
}

interface Follower {
  userUID: string;
}

export interface Comment {
  comment: string;
  dateTime: string;
  userUID: string;
}

export interface Like {
  userUID: string;
  key: string;
}

export interface Post {
  post: string;
  media: string;
  comments: Comment[];
  likes: Like[];
  dateTime: string;
  createdByUID: string;
}

export interface UserProfile extends User {
  posts: Post[] | null;
}

export interface UserProfileUID extends UserProfile {
  uid: string;
}
