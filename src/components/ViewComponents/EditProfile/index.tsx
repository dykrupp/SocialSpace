import React, { useContext, useState } from 'react';
import { Paper } from '@material-ui/core';
import { FirebaseContext } from '../../Firebase/context';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useHistory } from 'react-router';
import { AuthUserContext } from '../../Authentication/AuthProvider/context';

const useStyles = makeStyles(() => ({
  gridContainer: {
    padding: '20px',
  },
}));

export const EditProfilePage: React.FC = () => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const classes = useStyles();
  const history = useHistory();

  const onPictureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event.target.files) {
      setProfilePicture(event.target.files[0]);
    }
  };

  const onSaveClick = (): void => {
    //save profile picture in storage and update database with download url for profile pic
    if (firebase && authUser) {
      if (profilePicture) {
        firebase.storage
          .ref(`users/${authUser.uid}/profilePicture`)
          .put(profilePicture)
          .then((taskSnapShot) => {
            taskSnapShot.ref.getDownloadURL().then((url) => {
              history.goBack();
              firebase.user(authUser.uid).update({ profilePicURL: url });
              setProfilePicture(null);
            });
          });
      }
    }
  };

  const fileURL =
    profilePicture !== null
      ? URL.createObjectURL(profilePicture)
      : authUser?.profilePicURL;

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
            {fileURL === '' && <AccountCircle style={{ fontSize: '100px' }} />}
            {fileURL !== '' && (
              <img
                src={fileURL}
                style={{ height: '100px' }}
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
                style={{ display: 'none' }}
                onChange={onPictureChange}
              />
            </Button>
          </Grid>
          <Grid
            item
            style={{ display: 'flex', justifyContent: 'space-evenly' }}
          >
            <Button
              color="primary"
              variant="contained"
              style={{ width: '150px' }}
              onClick={(): void => history.goBack()}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              style={{ width: '150px' }}
              disabled={profilePicture === null}
              onClick={onSaveClick}
            >
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};
