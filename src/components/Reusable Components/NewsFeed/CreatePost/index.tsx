import React, { useContext, useState } from 'react';
import { AuthUserContext } from '../../../Authentication/AuthProvider/context';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { FirebaseContext } from '../../../Firebase/context';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import { getFirstName } from '../../../../utils/helperFunctions';
import PropTypes from 'prop-types';
import { OutlinedTextField } from '../../OutlinedTextField';
import { v1 as timestampGUID } from 'uuid';
import CircularProgress from '@material-ui/core/CircularProgress';

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
    alignItems: 'center',
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
    marginLeft: '19px',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'center',
  },
  postButton: {
    maxWidth: '300px',
    width: '100%',
  },
  image: {
    height: 'auto',
    width: '100%',
  },
  progressIcon: {
    marginLeft: '-20px',
    marginRight: '20px',
  },
}));

interface CreatePostProps {
  createdByUserUID: string;
  postUserUID: string;
}

const CreatePost: React.FC<CreatePostProps> = ({
  createdByUserUID,
  postUserUID,
}) => {
  const authUser = useContext(AuthUserContext);
  const firebase = useContext(FirebaseContext);
  const classes = useStyles();
  const [post, setPost] = useState('');
  const [picture, setPicture] = useState<File | null>();
  const [anchorEl, setAnchorEl] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setFirebasePost = async (postUID: string): Promise<void> => {
    if (firebase && authUser) {
      await firebase
        .post(postUserUID, postUID)
        .set({
          post,
          createdByUID: createdByUserUID,
          dateTime: new Date().toUTCString(),
        })
        .then(() => {
          setPost('');
        });
    }
  };

  const onPostButtonClick = async (): Promise<void> => {
    if (firebase && authUser) {
      setIsLoading(true);

      //Generating GUID so that we can guarantee our storage media exists for applicable posts when retriggering
      const postUID = timestampGUID();

      if (picture) {
        await firebase.storage
          .ref(`users/${postUserUID}/posts/${postUID}/media`)
          .put(picture)
          .then(async () => {
            setPicture(null);
            await setFirebasePost(postUID);
          });
      } else await setFirebasePost(postUID);

      setIsLoading(false);
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

  if (!authUser) return null;
  return (
    <Paper elevation={3} className={classes.paper}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <OutlinedTextField
            value={post}
            onChangeHandler={onPostInputChange}
            label="Create Post"
            placeholder={`What's on your mind ${getFirstName(
              authUser.fullName
            )}?`}
          />
        </Grid>
        <Grid item xs={12} className={classes.mediaRow}>
          <CircularProgress
            style={{ visibility: isLoading ? 'visible' : 'hidden' }}
            color="primary"
            className={classes.progressIcon}
          />
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
                  className={classes.image}
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

CreatePost.propTypes = {
  createdByUserUID: PropTypes.string.isRequired,
  postUserUID: PropTypes.string.isRequired,
};

export default CreatePost;
