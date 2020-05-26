import React, { useContext, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { AuthUserContext } from '../AuthProvider/context';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { FirebaseContext } from '../Firebase/context';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  post: {
    width: '500px',
    height: '200px',
  },
}));

const PostStatus: React.FC = () => {
  const authUser = useContext(AuthUserContext);
  const firebase = useContext(FirebaseContext);
  const classes = useStyles();
  const [status, setStatus] = useState('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setStatus(event.target.value);
  };

  const onClick = (): void => {
    if (firebase && authUser) {
      firebase.post(authUser.uid, '5-23-2020').push({ status });
    }
  };

  return (
    <div className={classes.root}>
      <h1>PostStatus Component </h1>
      <TextField
        name="status"
        type="text"
        value={status}
        onChange={onChange}
        className={classes.post}
        placeholder={`What's on your mind ${authUser?.fullName}`}
        variant="outlined"
        label="Create Post"
      />
      <Button onClick={onClick} color="primary" variant="contained">
        Post
      </Button>
    </div>
  );
};

export default PostStatus;
