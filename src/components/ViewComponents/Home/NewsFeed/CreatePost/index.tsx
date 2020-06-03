import React, { useContext, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { AuthUserContext } from '../../../../Authentication/AuthProvider/context';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { FirebaseContext } from '../../../../Firebase/context';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(() => ({
  paper: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto',
    padding: '20px',
  },
  post: {
    width: '100%',
  },
  input: {
    display: 'none',
  },
  mediaRow: {
    display: 'flex',
    justifyContent: 'center',
  },
  clickableImage: {
    maxHeight: '100px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  borderDiv: {
    height: '100px',
    width: '100px',
    border: '2px dashed #dddfe2',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '55px',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'center',
  },
  postButton: {
    width: '80%',
  },
}));

const CreatePost: React.FC = () => {
  const authUser = useContext(AuthUserContext);
  const firebase = useContext(FirebaseContext);
  const classes = useStyles();
  const [post, setPost] = useState('');
  const [picture, setPicture] = useState<File | null>();
  const [anchorEl, setAnchorEl] = React.useState<HTMLImageElement | null>(null);

  const sendFirebasePost = (utcDateTime: string): void => {
    if (firebase && authUser) {
      firebase
        .post(authUser.uid, utcDateTime)
        .set({ post })
        .then(() => {
          setPost('');
        });
    }
  };

  const onPostButtonClick = (): void => {
    if (firebase && authUser) {
      const utcDateTime = new Date().toUTCString();

      if (picture) {
        firebase.storage
          .ref(`users/${authUser.uid}/posts/${utcDateTime}/media`)
          .put(picture)
          .then(() => {
            sendFirebasePost(utcDateTime);
            setPicture(null);
          });
      } else sendFirebasePost(utcDateTime);
    }
  };

  const onPostInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPost(event.target.value);
  };

  const onPictureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files) {
      setPicture(event.target.files[0]);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLImageElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const fileURL = picture ? URL.createObjectURL(picture) : '';
  const isInvalid = post === '' && !picture;

  return (
    <Paper elevation={3} className={classes.paper}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="status"
            type="text"
            value={post}
            onChange={onPostInputChange}
            className={classes.post}
            placeholder={`What's on your mind ${
              authUser?.fullName.split(' ')[0]
            }?`}
            variant="outlined"
            label="Create Post"
          />
        </Grid>
        <Grid item xs={12} className={classes.mediaRow}>
          {!picture && (
            <div className={classes.borderDiv}>
              <AddIcon color="primary" fontSize="large" />
            </div>
          )}
          {picture && (
            <div>
              <img
                src={fileURL}
                className={classes.clickableImage}
                onClick={handleClick}
                alt="Clickable Media"
              />
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <img
                  src={fileURL}
                  style={{ height: 'auto', width: '100%' }}
                  onClick={handleClick}
                  alt="Selected Media"
                />
              </Popover>
            </div>
          )}
          <Tooltip title="Add Photo">
            <IconButton color="primary" component="label">
              <AddAPhotoIcon fontSize="large" />
              <input
                accept="image/*"
                className={classes.input}
                id="icon-button-file"
                type="file"
                onChange={onPictureChange}
              />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={12} className={classes.buttonRow}>
          <Button
            disabled={isInvalid}
            onClick={onPostButtonClick}
            color="primary"
            variant="contained"
            className={classes.postButton}
          >
            Post
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CreatePost;
