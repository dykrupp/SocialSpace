import React, { useContext, useState } from 'react';
import { Paper, Typography } from '@material-ui/core';
import { FirebaseContext } from '../../Firebase/context';
import { Grid } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useHistory } from 'react-router';
import { AuthUserContext } from '../../Authentication/AuthProvider/context';
import { getFirstName } from '../../../utils/helperFunctions';
import Backdrop from '@material-ui/core/Backdrop';
import { IsLoading } from '../../Reusable Components/IsLoading';
import { BlueOutlinedTextField } from '../../Reusable Components/OutlinedTextField/index';
import { CustomDivider } from '../../Reusable Components/CustomDivider';

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    textAlign: 'center',
  },
  gridContainer: {
    padding: '20px',
  },
  accountIcon: {
    fontSize: '100px',
  },
  image: {
    height: '150px',
  },
  button: {
    maxWidth: '150px',
    width: '100%',
    margin: '5px',
    height: '45px',
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
  heading: {
    marginBottom: '-2px',
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
        .put(profilePicture, { cacheControl: 'public, max-age=4000' })
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
      <Paper elevation={3} className={`mainContainer ${classes.paper}`}>
        <Grid
          container
          direction="column"
          className={classes.gridContainer}
          spacing={2}
        >
          <Grid item>
            <Typography className={classes.heading} variant="h4">
              Edit Profile
            </Typography>
            <CustomDivider />
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
            <BlueOutlinedTextField
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
              Save
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
