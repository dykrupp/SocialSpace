/* eslint-disable no-undef */
import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../Firebase/context';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { useParams } from 'react-router-dom';
import { User, Post } from '../../../constants/interfaces';
import {
  addMediaToPosts,
  getSortedPosts,
} from '../../../utils/helperFunctions';

const useStyles = makeStyles(() => ({
  profileDiv: {
    padding: '20px',
  },
  profileImage: {
    width: '150px',
    height: '150px',
  },
}));

interface UserProfile extends User {
  posts: Post[] | null;
}

export const ProfilePage: React.FC = () => {
  const classes = useStyles();
  const { userUID } = useParams();
  const firebase = useContext(FirebaseContext);
  const [userProfile, setUserProfile] = useState<UserProfile>();

  useEffect(() => {
    firebase?.user(userUID).on('value', async (snapShot) => {
      const userProfile = snapShot.val() as UserProfile;
      userProfile.posts = await addMediaToPosts(
        firebase,
        userUID,
        getSortedPosts(userProfile.posts)
      );
      setUserProfile(userProfile);
    });

    return function cleanup(): void {
      if (firebase) firebase.user(userUID).off();
    };
  }, [firebase, userUID]);

  return (
    <div className={classes.profileDiv}>
      <div>
        <AccountCircle className={classes.profileImage} />
        <p>{userProfile?.fullName}</p>
      </div>
      <p>{userUID}</p>
    </div>
  );
};
