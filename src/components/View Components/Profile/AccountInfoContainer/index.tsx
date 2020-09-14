import React, { useContext, useState, useEffect } from 'react';
import { UserProfileUID } from '../../../../constants/interfaces';
import PropTypes from 'prop-types';
import { FirebaseContext } from '../../../Firebase/context';
import { AuthUserContext } from '../../../Authentication/AuthProvider/context';
import { useMobileComponents } from '../../../../utils/hooks/useMobileComponents';
import { AccountInfo } from './AccountInfo';
import { MobileAccountInfo } from './MobileAccountInfo';

interface AccountInfoContainerProps {
  userProfile: UserProfileUID;
  rootWidth: number;
}

export const AccountInfoContainer: React.FC<AccountInfoContainerProps> = ({
  userProfile,
  rootWidth,
}) => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const isMobile = useMobileComponents();
  let followerKey = '';
  let followingKey = '';

  const followUser = (): void => {
    if (authUser) {
      firebase
        ?.followers(userProfile.uid)
        .push({ userUID: authUser.uid })
        .then((ref) => {
          followerKey = ref.key ? ref.key : '';
          setIsFollowingUser(true);
        });

      firebase
        ?.followings(authUser.uid)
        .push({ userUID: userProfile.uid })
        .then((ref) => {
          followingKey = ref.key ? ref.key : '';
        });
    }
  };

  const unFollowUser = (): void => {
    if (authUser && firebase) {
      firebase
        .follower(userProfile.uid, followerKey)
        .remove()
        .then(() => setIsFollowingUser(false));

      firebase.following(authUser.uid, followingKey).remove();
    }
  };

  useEffect(() => {
    if (authUser && userProfile && userProfile.followers) {
      setIsFollowingUser(
        userProfile.followers.some((x) => x.userUID === authUser.uid)
      );
    }
  }, [authUser, userProfile]);

  const isUsersProfile = authUser ? authUser.uid === userProfile.uid : false;

  return isMobile ? (
    <MobileAccountInfo
      isUsersProfile={isUsersProfile}
      userProfile={userProfile}
      isFollowingUser={isFollowingUser}
      followUser={followUser}
      unfollowUser={unFollowUser}
      rootWidth={rootWidth}
    />
  ) : (
    <AccountInfo
      rootWidth={rootWidth}
      isUsersProfile={isUsersProfile}
      userProfile={userProfile}
      isFollowingUser={isFollowingUser}
      followUser={followUser}
      unfollowUser={unFollowUser}
    />
  );
};

AccountInfoContainer.propTypes = {
  userProfile: PropTypes.any.isRequired,
  rootWidth: PropTypes.number.isRequired,
};
