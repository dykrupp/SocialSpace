import React, { useState, useContext } from 'react';
import { FirebaseError } from 'firebase';
import { FirebaseContext } from '../../../Firebase/context';
import { FIREBASE_NOT_ACCESSIBLE } from '../../../../customExports/labels';
import SignUpFormStyle from './SignUpFormStyle';

interface FormState {
  username: string;
  email: string;
  passwordOne: string;
  passwordTwo: string;
  error: string;
  birthday: string;
  gender: string;
}

const initialFormState: FormState = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: '',
  birthday: '1995-05-21',
  gender: '',
};

const SignUpForm: React.FC = () => {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const firebase = useContext(FirebaseContext);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    const { username, email, passwordOne, birthday, gender } = formState;
    if (firebase) {
      firebase
        .createUser(email, passwordOne)
        .then((authUser) => {
          if (authUser.user) {
            return firebase
              .user(authUser.user.uid)
              .set({ username, email, birthday, gender });
          }
        })
        .catch((error: FirebaseError) => {
          setFormState((previousState) => {
            return { ...previousState, error: error.message };
          });
        });
    }

    event.preventDefault();
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.persist(); //needed to be used withing 'setState()'

    setFormState((previousState) => {
      return { ...previousState, [event.target.name]: event.target.value };
    });
  };

  const {
    username,
    email,
    passwordOne,
    passwordTwo,
    error,
    birthday,
    gender,
  } = formState;

  if (!firebase) return <h1>{FIREBASE_NOT_ACCESSIBLE}</h1>;
  return (
    <SignUpFormStyle
      username={username}
      email={email}
      passwordOne={passwordOne}
      passwordTwo={passwordTwo}
      birthday={birthday}
      onChange={onChange}
      onSubmit={onSubmit}
      gender={gender}
      error={error}
    />
  );
};

export default SignUpForm;
