import React, { useState, useContext } from 'react';
import { FirebaseError } from 'firebase';
import { FirebaseContext } from '../../../Firebase/context';
import { FIREBASE_NOT_ACCESSIBLE } from '../../../../constants/labels';
import SignInFormStyle from './SignInFormStyle';

interface FormState {
  email: string;
  password: string;
  error: string;
}

const initialFormState: FormState = {
  email: '',
  password: '',
  error: '',
};

const SignInForm: React.FC = () => {
  const [formState, setFormState] = useState<FormState>(initialFormState);
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
    <SignInFormStyle
      email={email}
      password={password}
      error={error}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
};

export default SignInForm;
