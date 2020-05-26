import React, { useContext } from 'react';
import ChangePasswordForm from '../../ChangePassword';
import { AuthUserContext } from '../../AuthProvider/context';

const Settings: React.FC = () => {
  return (
    <div>
      <h1>Account: {useContext(AuthUserContext)?.email}</h1>
      <ChangePasswordForm />
    </div>
  );
};

export default Settings;
