import React, { useState, useContext } from 'react';
import { FirebaseContext } from '../../Firebase/context';
import { FIREBASE_NOT_ACCESSIBLE } from '../../../customExports/labels';
import { FirebaseError } from 'firebase';
import { useHistory } from 'react-router';
import * as ROUTES from '../../../customExports/routes';
import ForgotPasswordFormStyle from './ForgotPasswordFormStyle';

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
        .then(() => history.push(ROUTES.LANDING))
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

  if (!firebase) return <h1>{FIREBASE_NOT_ACCESSIBLE}</h1>;
  return (
    <ForgotPasswordFormStyle
      email={email}
      error={error}
      onChange={onEmailChange}
      onSubmit={onSubmit}
    />
  );
};

export default ForgotPasswordForm;
