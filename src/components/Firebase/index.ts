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

  followers = (userUID: string): app.database.Reference =>
    this.db.ref(`users/${userUID}/followers`);

  follower = (userUID: string, followerUID: string): app.database.Reference =>
    this.db.ref(`users/${userUID}/followers/${followerUID}`);

  following = (userUID: string, followerUID: string): app.database.Reference =>
    this.db.ref(`users/${userUID}/followings/${followerUID}`);

  followings = (userUID: string): app.database.Reference =>
    this.db.ref(`users/${userUID}/followings/`);

  post = (userUID: string, dateTime: string): app.database.Reference =>
    this.db.ref(`posts/${userUID}/${dateTime}`);

  posts = (userUID: string): app.database.Reference =>
    this.db.ref(`posts/${userUID}`);

  like = (
    postUserID: string,
    postDateTime: string,
    key: string
  ): app.database.Reference =>
    this.db.ref(`posts/${postUserID}/${postDateTime}/likes/${key}`);

  likes = (postUserID: string, postDateTime: string): app.database.Reference =>
    this.db.ref(`posts/${postUserID}/${postDateTime}/likes`);

  comment = (
    postUserID: string,
    postDateTime: string,
    commentDateTime: string
  ): app.database.Reference =>
    this.db.ref(
      `posts/${postUserID}/${postDateTime}/comments/${commentDateTime}`
    );

  comments = (
    postUserID: string,
    postDateTime: string
  ): app.database.Reference =>
    this.db.ref(`posts/${postUserID}/${postDateTime}/comments`);

  chatUIDS = (): app.database.Reference => this.db.ref(`chatUIDS`);

  messages = (chatUID: string): app.database.Reference =>
    this.db.ref(`chats/${chatUID}/messages`);

  lastSeenChat = (chatUID: string, userUID: string): app.database.Reference =>
    this.db.ref(`chatUIDS/${chatUID}/userUIDS/${userUID}/lastSeen`);
}

export default Firebase;
