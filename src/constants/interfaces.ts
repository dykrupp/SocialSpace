export interface User {
  fullName: string;
  email: string;
  birthday: string;
  gender: string;
  followings: Following[];
  followers: Follower[];
  profilePicURL: string;
  aboutMe: string;
}

export interface UserUID extends User {
  uid: string;
}

export interface Following {
  userUID: string;
}

export interface Follower {
  userUID: string;
}

export interface Comment {
  comment: string;
  dateTime: string;
  userUID: string;
  commentUID: string;
}

export interface Like {
  userUID: string;
  likeUID: string;
}

export interface Post {
  post: string;
  media: string;
  comments: Comment[];
  likes: Like[];
  dateTime: string;
  createdByUID: string;
  userUID: string;
  postUID: string;
}

export interface UserProfile extends User {
  posts: Post[] | null;
}

export interface UserProfileUID extends UserProfile {
  uid: string;
}

export interface UserUID {
  userUID: string;
  lastSeen: string;
}

export interface ChatUID {
  userUIDS: UserUID[];
  uid: string;
  lastWriteTime: string;
  lastWriteUID: string;
}

export interface Message {
  userUID: string;
  text: string;
  dateTime: string;
}

export interface Notification {
  read: boolean;
  triggerUserUID: string;
  type: NotificationType;
  dateTime: string;
  notificationUID: string;
}

export interface SignInFormState {
  email: string;
  password: string;
  error: string;
}

export interface AccountInfoProps {
  userProfile: UserProfileUID;
  isUsersProfile: boolean;
  isFollowingUser: boolean;
  followUser: () => void;
  unfollowUser: () => void;
  rootWidth: number;
}

enum NotificationType {
  follower = 'follower',
  like = 'like',
  comment = 'comment',
}
