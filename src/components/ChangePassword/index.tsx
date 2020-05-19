import React, { useState, useContext } from 'react';
import { FirebaseContext } from '../Firebase/context';
import { FirebaseError } from 'firebase';
import { FIREBASE_NOT_ACCESSIBLE } from '../../customExports/labels';

interface FormState {
  passwordOne: string;
  passwordTwo: string;
  message: string;
}

const initialFormState: FormState = {
  passwordOne: '',
  passwordTwo: '',
  message: '',
};

const ChangePasswordForm: React.FC = () => {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const firebase = useContext(FirebaseContext);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    if (firebase) {
      firebase
        .updatePassword(formState.passwordOne)
        .then(() => {
          setFormState((previousState) => {
            return {
              ...previousState,
              message: 'Password updated successfully.',
            };
          });
        })
        .catch((error: FirebaseError) => {
          setFormState((previousState) => {
            return { ...previousState, message: error.message };
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

  const { passwordOne, passwordTwo, message } = formState;
  const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

  if (!firebase) return <h1>{FIREBASE_NOT_ACCESSIBLE}</h1>;
  return (
    <form onSubmit={onSubmit}>
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={onChange}
        type="password"
        placeholder="New Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange}
        type="password"
        placeholder="Confirm New Password"
      />
      <button disabled={isInvalid} type="submit">
        Reset My Password
      </button>

      <p>{message}</p>
    </form>
  );
};

export default ChangePasswordForm;
