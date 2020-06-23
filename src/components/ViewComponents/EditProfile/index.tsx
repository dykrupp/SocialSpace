import React, { useContext, useState } from 'react';
import { Paper } from '@material-ui/core';
import { FirebaseContext } from '../../Firebase/context';
import { Grid } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useHistory } from 'react-router';
import { AuthUserContext } from '../../Authentication/AuthProvider/context';
import TextField from '@material-ui/core/TextField';
import { getFirstName } from '../../../utils/helperFunctions';
import Backdrop from '@material-ui/core/Backdrop';
import { IsLoading } from '../../IsLoading';

const useStyles = makeStyles((theme: Theme) => ({
  gridContainer: {
    padding: '20px',
  },
  accountIcon: {
    fontSize: '100px',
  },
  image: {
    height: '100px',
  },
  button: {
    width: '150px',
  },
  buttonGrid: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  buttonInput: {
    display: 'none',
  },
  aboutMeInput: {
    width: '75%',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export const EditProfile: React.FC = () => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [aboutMe, setAboutMe] = useState(authUser?.aboutMe);
  const [isSaving, setIsSaving] = useState(false);
  const classes = useStyles();
  const history = useHistory();

  const onPictureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files) {
      setProfilePicture(event.target.files[0]);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setAboutMe(event.target.value);
  };

  const updateProfilePic = async (): Promise<void> => {
    if (firebase && authUser && profilePicture) {
      await firebase.storage
        .ref(`users/${authUser.uid}/profilePicture`)
        .put(profilePicture)
        .then(async (taskSnapShot) => {
          await taskSnapShot.ref.getDownloadURL().then((url) => {
            firebase.user(authUser.uid).update({ profilePicURL: url });
          });
        });
    }
  };

  const onSaveClick = (): void => {
    if (firebase && authUser) {
      setIsSaving(true);

      const isAboutEmpty = aboutMe === '';

      if (profilePicture && isAboutEmpty) {
        updateProfilePic().then(() => {
          setIsSaving(false);
          history.goBack();
        });
      } else if (profilePicture && !isAboutEmpty) {
        updateProfilePic()
          .then(() => firebase.user(authUser.uid).update({ aboutMe: aboutMe }))
          .then(() => {
            setIsSaving(false);
            history.goBack();
          });
      } else if (!profilePicture && !isAboutEmpty) {
        firebase
          .user(authUser.uid)
          .update({ aboutMe: aboutMe })
          .then(() => {
            setIsSaving(false);
            history.goBack();
          });
      }
    }
  };

  const fileURL =
    profilePicture !== null
      ? URL.createObjectURL(profilePicture)
      : authUser?.profilePicURL;

  if (!authUser) return null;
  return (
    <div className="mainRoot">
      <Paper
        elevation={3}
        className="mainContainer"
        style={{ textAlign: 'center' }}
      >
        <Grid
          container
          direction="column"
          className={classes.gridContainer}
          spacing={2}
        >
          <Grid item>
            <h1>Edit Profile</h1>
            <hr />
          </Grid>
          <Grid item>
            {fileURL === '' && (
              <AccountCircle className={classes.accountIcon} />
            )}
            {fileURL !== '' && (
              <img
                src={fileURL}
                className={classes.image}
                alt="Clickable Media"
              />
            )}
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Upload Profile Picture
              <input
                accept="image/*"
                type="file"
                className={classes.buttonInput}
                onChange={onPictureChange}
              />
            </Button>
          </Grid>
          <Grid item>
            <TextField
              id="outlined-multiline-static"
              label="About Me"
              multiline
              rows={2}
              className={classes.aboutMeInput}
              value={aboutMe}
              onChange={onChange}
              inputProps={{ maxLength: 200 }}
              placeholder={`Tell us more about yourself, ${getFirstName(
                authUser.fullName
              )}!`}
              variant="outlined"
            />
          </Grid>
          <Grid item className={classes.buttonGrid}>
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={(): void => history.goBack()}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              disabled={profilePicture === null && aboutMe === ''}
              onClick={onSaveClick}
            >
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Backdrop className={classes.backdrop} open={isSaving}>
        <IsLoading text="Saving" />
      </Backdrop>
    </div>
  );
};
