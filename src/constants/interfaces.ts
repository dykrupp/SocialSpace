export interface User {
  fullName: string;
  email: string;
  birthday: string;
  gender: string;
}

export interface Comment {
  comment: string;
  dateTime: string;
  userUID: string;
  fullName: string;
}

export interface Like {
  userUID: string;
  fullName: string;
}

export interface Post {
  post: string;
  media: string;
  comments: Comment[];
  likes: Like[];
  dateTime: string;
}

export interface UserProfile extends User {
  posts: Post[] | null;
}

export interface UserProfileUID extends UserProfile {
  uid: string;
}
