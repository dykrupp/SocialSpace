import React from 'react';
import { Paper } from '@material-ui/core';

export const EditProfilePage: React.FC = () => {
  return (
    <div className="mainRoot">
      <Paper
        elevation={3}
        className="mainContainer"
        style={{ textAlign: 'center' }}
      >
        <h1>Edit Profile Page</h1>
      </Paper>
    </div>
  );
};
