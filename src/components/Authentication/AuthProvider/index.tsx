/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthUserContext, AuthUser } from './context';
import PropTypes from 'prop-types';
import { FirebaseContext } from '../../Firebase/context';
import { useHistory } from 'react-router';
import { User } from '../../../constants/interfaces';
import { IsLoading } from '../../IsLoading';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const firebase = useContext(FirebaseContext);
  const [authUser, setAuthUser] = useState<AuthUser>(null);
  const [isLoading, setIsLoading] = useState(true); //used to prevent loading views until we get feedback from firebase
  const history = useHistory();
  const user = useRef<User>();
  const userUID = useRef<string>();

  useEffect(() => {
    const listener = firebase?.auth.onAuthStateChanged((authUser) => {
      setIsLoading(true);

      if (authUser) {
        userUID.current = authUser.uid;

        firebase?.user(authUser.uid).on('value', (snapShot) => {
          user.current = snapShot.val() as User;
          setAuthUser(() => {
            return {
              ...authUser,
              ...(user.current as User),
            };
          });
          setIsLoading(false);
        });

        //update authUser to include updated profile pic url
        firebase?.db
          .ref(`users/${authUser.uid}/profilePicURL`)
          .on('value', (snapshot) => {
            user.current = {
              ...(user.current as User),
              profilePicURL: snapshot.val(),
            };
            setAuthUser(() => {
              return {
                ...authUser,
                ...(user.current as User),
              };
            });
          });
      } else {
        setAuthUser(null);
        setIsLoading(false);
      }
    });

    return function cleanup(): void {
      if (listener) listener();
      if (userUID.current) {
        firebase?.user(userUID.current).off();
        firebase?.db.ref(`users/${userUID.current}/profilePicURL`).off();
      }
    };
  }, [firebase, history]);

  if (isLoading) return <IsLoading />;
  else
    return (
      <AuthUserContext.Provider value={authUser}>
        {children}
      </AuthUserContext.Provider>
    );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
