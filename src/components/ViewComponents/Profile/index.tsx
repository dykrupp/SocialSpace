import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../Firebase/context';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { UserProfileUID } from '../../../constants/interfaces';
import { AuthUserContext } from '../../Authentication/AuthProvider/context';
import { IsLoading } from '../../IsLoading';
import { AccountInfo } from './AccountInfo';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import { Grid } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import ReceiptIcon from '@material-ui/icons/Receipt';
import PeopleIcon from '@material-ui/icons/People';
import NewsFeed from '../../NewsFeed';

const useStyles = makeStyles(() => ({
  mainSurface: {
    flexGrow: 1,
    width: '750px',
    margin: '0 auto',
    marginTop: '20px',
  },
  gridContainer: {
    padding: '20px',
  },
}));

export const ProfilePage: React.FC = () => {
  const classes = useStyles();
  const { userUID } = useParams();
  const firebase = useContext(FirebaseContext);
  const [userProfile, setUserProfile] = useState<UserProfileUID>();
  const [isLoading, setIsLoading] = useState(true);
  const authUser = useContext(AuthUserContext);
  const [tabIndex, setTabIndex] = React.useState(0);

  useEffect(() => {
    firebase?.user(userUID).on('value', async (snapShot) => {
      const userProfile: UserProfileUID = { ...snapShot.val(), uid: userUID };
      setUserProfile(userProfile);
      setIsLoading(false);
    });

    return function cleanup(): void {
      firebase?.user(userUID).off();
    };
  }, [firebase, userUID]);

  const handleChange = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ): void => {
    setTabIndex(newValue);
  };

  if (isLoading || !userProfile || !authUser) return <IsLoading />;
  const isUsersProfile = authUser.uid === userUID;
  return (
    <Paper elevation={3} className={classes.mainSurface}>
      <Grid container direction="column" className={classes.gridContainer}>
        <Grid item>
          <AccountInfo
            isUsersProfile={isUsersProfile}
            userProfile={userProfile}
          />
        </Grid>
        <Grid item>
          <hr />
        </Grid>
        <Grid item>
          <AppBar position="static" color="default">
            <Tabs
              value={tabIndex}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab icon={<ReceiptIcon />} label="Posts" />
              <Tab icon={<PeopleIcon />} label="Following" />
              <Tab icon={<PersonPinIcon />} label="Followers" />
            </Tabs>
          </AppBar>
        </Grid>
        <Grid item style={{ textAlign: 'center' }}>
          {tabIndex === 0 && (
            <NewsFeed isProfileFeed={true} userUID={userProfile.uid} />
          )}
          {tabIndex === 1 && <h1>Following</h1>}
          {tabIndex === 2 && <h1>Followers</h1>}
        </Grid>
      </Grid>
    </Paper>
  );
};
