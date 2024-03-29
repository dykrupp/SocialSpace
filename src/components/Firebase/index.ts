/* eslint-disable no-undef */
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

class Firebase {
  auth: app.auth.Auth;
  db: app.database.Database;
  storage: app.storage.Storage;
  functions: app.functions.Functions;

  constructor() {
    app.initializeApp(firebaseConfig);

    this.auth = app.auth();
    this.db = app.database();
    this.storage = app.storage();
    this.functions = app.functions();
  }

  createUser = (
    email: string,
    password: string
  ): Promise<app.auth.UserCredential> =>
    this.auth.createUserWithEmailAndPassword(email, password);

  signIn = (
    email: string,
    password: string
  ): Promise<app.auth.UserCredential> =>
    this.auth.signInWithEmailAndPassword(email, password);

  signOut = (): Promise<void> => this.auth.signOut();

  resetPassword = (email: string): Promise<void> =>
    this.auth.sendPasswordResetEmail(email);

  updatePassword = (password: string): Promise<void> => {
    if (this.auth.currentUser) {
      return this.auth.currentUser.updatePassword(password);
    } else return Promise.resolve();
  };

  user = (userUID: string): app.database.Reference =>
    this.db.ref(`users/${userUID}`);

  users = (): app.database.Reference => this.db.ref('users');

  notifications = (userUID: string): app.database.Reference =>
    this.db.ref(`notifications/${userUID}`);

  notification = (
    userUID: string,
    notificationUID: string
  ): app.database.Reference =>
    this.db.ref(`notifications/${userUID}/${notificationUID}`);

  followers = (userUID: string): app.database.Reference =>
    this.db.ref(`users/${userUID}/followers`);

  follower = (userUID: string, followerUID: string): app.database.Reference =>
    this.db.ref(`users/${userUID}/followers/${followerUID}`);

  following = (userUID: string, followerUID: string): app.database.Reference =>
    this.db.ref(`users/${userUID}/followings/${followerUID}`);

  followings = (userUID: string): app.database.Reference =>
    this.db.ref(`users/${userUID}/followings/`);

  post = (userUID: string, postUID: string): app.database.Reference =>
    this.db.ref(`posts/${userUID}/${postUID}`);

  posts = (userUID: string): app.database.Reference =>
    this.db.ref(`posts/${userUID}`);

  like = (
    userUID: string,
    postUID: string,
    likesUID: string
  ): app.database.Reference =>
    this.db.ref(`posts/${userUID}/${postUID}/likes/${likesUID}`);

  likes = (userUID: string, postUID: string): app.database.Reference =>
    this.db.ref(`posts/${userUID}/${postUID}/likes`);

  comment = (
    userUID: string,
    postUID: string,
    commentUID: string
  ): app.database.Reference =>
    this.db.ref(`posts/${userUID}/${postUID}/comments/${commentUID}`);

  comments = (userUID: string, postUID: string): app.database.Reference =>
    this.db.ref(`posts/${userUID}/${postUID}/comments`);

  chatUIDS = (): app.database.Reference => this.db.ref(`chatUIDS`);

  messages = (chatUID: string): app.database.Reference =>
    this.db.ref(`chats/${chatUID}/messages`);

  lastSeenChat = (chatUID: string, userUID: string): app.database.Reference =>
    this.db.ref(`chatUIDS/${chatUID}/userUIDS/${userUID}/lastSeen`);
}

export default Firebase;
