import React, { useState, useContext } from 'react';
import { FirebaseError } from 'firebase';
import { useHistory } from 'react-router';
import * as ROUTES from '../../customExports/routes';
import { FirebaseContext } from '../Firebase/context';
import { FIREBASE_NOT_ACCESSIBLE } from '../../customExports/labels';

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
  const history = useHistory();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    const { email, password } = formState;

    if (firebase) {
      firebase
        .signIn(email, password)
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
    event.persist(); //needed to be used within 'setState()'

    setFormState((previousState) => {
      return { ...previousState, [event.target.name]: event.target.value };
    });
  };

  const { email, password, error } = formState;
  const isInvalid = password === '' || email === '';

  if (!firebase) return <h1>{FIREBASE_NOT_ACCESSIBLE}</h1>;
  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="password"
        value={password}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <button disabled={isInvalid} type="submit">
        Sign In
      </button>

      <p>{error}</p>
    </form>
  );
};

export default SignInForm;
