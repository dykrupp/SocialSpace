import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../Firebase/context';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { UserProfile } from '../../../constants/interfaces';
import { AuthUserContext } from '../../Authentication/AuthProvider/context';
import { IsLoading } from '../../IsLoading';
import {
  addMediaToPosts,
  getSortedPosts,
} from '../../../utils/helperFunctions';
import { AccountInfo } from './AccountInfo';

const useStyles = makeStyles(() => ({
  mainDiv: {
    padding: '20px',
  },
}));

export const ProfilePage: React.FC = () => {
  const classes = useStyles();
  const { userUID } = useParams();
  const firebase = useContext(FirebaseContext);
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [isLoading, setIsLoading] = useState(true);
  const authUser = useContext(AuthUserContext);

  useEffect(() => {
    firebase?.user(userUID).on('value', async (snapShot) => {
      const userProfile = snapShot.val() as UserProfile;
      userProfile.posts = await addMediaToPosts(
        firebase,
        userUID,
        getSortedPosts(userProfile.posts)
      );
      setUserProfile(userProfile);
      setIsLoading(false);
    });

    return function cleanup(): void {
      if (firebase) firebase.user(userUID).off();
    };
  }, [firebase, userUID]);

  if (isLoading || !userProfile || !authUser) return <IsLoading />;
  const isUsersProfile = authUser.uid === userUID;
  return (
    <div className={classes.mainDiv}>
      <AccountInfo isUsersProfile={isUsersProfile} userProfile={userProfile} />
      <hr />
    </div>
  );
};
