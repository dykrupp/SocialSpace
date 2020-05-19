import React, { useState, useContext, useEffect } from 'react';
import { AuthUserContext } from './context';
import PropTypes from 'prop-types';
import { FirebaseContext } from '../Firebase/context';
import { AuthUser } from '../../customExports/types';
import { useHistory } from 'react-router';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const firebase = useContext(FirebaseContext);
  const [authorizedUser, setAuthorizedUser] = useState<AuthUser>(null);
  const history = useHistory();

  useEffect(() => {
    const listener = firebase?.auth.onAuthStateChanged((authUser) => {
      if (authUser) setAuthorizedUser(authUser);
      else setAuthorizedUser(null);
    });

    return function cleanup(): void {
      if (listener) listener();
    };
  }, [firebase, history]);

  return (
    <AuthUserContext.Provider value={authorizedUser}>
      {children}
    </AuthUserContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
