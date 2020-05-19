import React, { useContext } from 'react';
import { FirebaseContext } from '../Firebase/context';
import { FIREBASE_NOT_ACCESSIBLE } from '../../customExports/labels';

const SignOut: React.FC = () => {
  const firebase = useContext(FirebaseContext);

  if (firebase) {
    return (
      <button type="button" onClick={firebase.signOut}>
        Sign Out
      </button>
    );
  } else return <h1>{FIREBASE_NOT_ACCESSIBLE}</h1>;
};

export default SignOut;
