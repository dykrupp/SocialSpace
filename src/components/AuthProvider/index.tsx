import React, { useState, useContext, useEffect } from 'react';
import { AuthUserContext, AuthUser } from './context';
import PropTypes from 'prop-types';
import { FirebaseContext } from '../Firebase/context';
import { useHistory } from 'react-router';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const firebase = useContext(FirebaseContext);
  const [authUser, setAuthUser] = useState<AuthUser>(null);
  const [isLoading, setIsLoading] = useState(true); //used to prevent loading views until we get feedback from firebase
  const history = useHistory();

  useEffect(() => {
    const listener = firebase?.auth.onAuthStateChanged((authUser) => {
      setAuthUser(authUser);
      setIsLoading(false);
    });

    return function cleanup(): void {
      if (listener) listener();
    };
  }, [firebase, history]);

  if (isLoading)
    return <h1 style={{ textAlign: 'center' }}>Loading Please Wait</h1>;
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
