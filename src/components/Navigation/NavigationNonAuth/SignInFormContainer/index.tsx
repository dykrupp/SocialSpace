import React, { useState, useContext } from 'react';
import { FirebaseError } from 'firebase';
import { FirebaseContext } from '../../../Firebase/context';
import { FIREBASE_NOT_ACCESSIBLE } from '../../../../utils/constants/labels';
import SignInForm from './SignInForm';
import { SignInFormState } from '../../../../utils/constants/interfaces';

const initialFormState: SignInFormState = {
  email: '',
  password: '',
  error: '',
};

const SignInFormContainer: React.FC = () => {
  const [formState, setFormState] = useState<SignInFormState>(initialFormState);
  const firebase = useContext(FirebaseContext);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    const { email, password } = formState;

    if (firebase) {
      firebase.signIn(email, password).catch((error: FirebaseError) => {
        setFormState((previousState) => {
          return { ...previousState, error: error.message };
        });
      });
    }

    event.preventDefault();
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.persist(); //needed to be used within 'setState()'

    setFormState((previousState) => {
      return { ...previousState, [event.target.name]: event.target.value };
    });
  };

  const { email, password, error } = formState;

  if (!firebase) return <h1>{FIREBASE_NOT_ACCESSIBLE}</h1>;
  return (
    <SignInForm
      email={email}
      password={password}
      error={error}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
};

export default SignInFormContainer;
