import React, { useState, useContext } from 'react';
import SignUpLink from './SignUpLink';
import { FirebaseError } from 'firebase';
import { useHistory } from 'react-router';
import * as ROUTES from '../../customExports/routes';
import { FirebaseContext } from '../Firebase/context';
import { FIREBASE_NOT_ACCESSIBLE } from '../../customExports/labels';

interface FormState {
  username: string;
  email: string;
  passwordOne: string;
  passwordTwo: string;
  error: string;
}

const initialFormState: FormState = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: '',
};

const SignUpForm: React.FC = () => {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const firebase = useContext(FirebaseContext);
  const history = useHistory();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    const { username, email, passwordOne } = formState;
    if (firebase) {
      firebase
        .createUser(email, passwordOne)
        .then((authUser) => {
          if (authUser.user) {
            return firebase.user(authUser.user.uid).set({ username, email });
          }
        })
        .then(() => {
          setFormState(() => initialFormState);
          history.push(ROUTES.HOME);
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

  const isInvalid =
    formState.passwordOne !== formState.passwordTwo ||
    formState.passwordOne === '' ||
    formState.email === '' ||
    formState.username === '';

  const { username, email, passwordOne, passwordTwo, error } = formState;

  if (!firebase) return <h1>{FIREBASE_NOT_ACCESSIBLE}</h1>;
  return (
    <form onSubmit={onSubmit}>
      <input
        name="username"
        value={username}
        onChange={onChange}
        type="text"
        placeholder="Full Name"
      />
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange}
        type="password"
        placeholder="Confirm Password"
      />
      <button type="submit" disabled={isInvalid}>
        Sign Up
      </button>

      <p>{error}</p>
    </form>
  );
};

export default SignUpForm;

export { SignUpLink };
