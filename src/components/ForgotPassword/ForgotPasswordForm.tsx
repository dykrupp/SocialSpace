import React, { useState, useContext } from 'react';
import { FirebaseContext } from '../Firebase/context';
import { FIREBASE_NOT_ACCESSIBLE } from '../../customExports/labels';
import { FirebaseError } from 'firebase';
import { useHistory } from 'react-router';
import * as ROUTES from '../../customExports/routes';

interface FormState {
  email: string;
  error: string;
}

const initialFormState: FormState = {
  email: '',
  error: '',
};

const ForgotPasswordForm: React.FC = () => {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const firebase = useContext(FirebaseContext);
  const history = useHistory();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    if (firebase) {
      firebase
        .resetPassword(formState.email)
        .then(() => {
          setFormState(() => initialFormState);
          history.push(ROUTES.SIGN_IN);
        })
        .catch((error: FirebaseError) => {
          setFormState((previousState) => {
            return { ...previousState, error: error.message };
          });
        });
    }

    event.preventDefault();
  };

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.persist(); //needed to be used within 'setState()'

    setFormState((previousState) => {
      return { ...previousState, email: event.target.value };
    });
  };

  const { email, error } = formState;
  const isInvalid = email === '';

  if (!firebase) return <h1>{FIREBASE_NOT_ACCESSIBLE}</h1>;
  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        value={email}
        onChange={onEmailChange}
        type="text"
        placeholder="Email Address"
      />
      <button disabled={isInvalid} type="submit">
        Reset My Password
      </button>

      <p>{error}</p>
    </form>
  );
};

export default ForgotPasswordForm;
