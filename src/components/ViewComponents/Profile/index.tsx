/* eslint-disable react-hooks/exhaustive-deps */
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
import { convertToUserProfile } from '../../../utils/helperFunctions';
import { UserInfo } from './UserInfo';

const useStyles = makeStyles(() => ({
  gridContainer: {
    padding: '20px',
  },
  centerTextAlign: {
    textAlign: 'center',
  },
  centerContent: {
    justifyContent: 'center',
    marginTop: '20px',
    height: '55px',
  },
  link: {
    textDecoration: 'none',
    fontSize: '25px',
    marginTop: '20px',
  },
}));

export const ProfilePage: React.FC = () => {
  const classes = useStyles();
  const { userUID } = useParams();
  const firebase = useContext(FirebaseContext);
  const [userProfile, setUserProfile] = useState<UserProfileUID>();
  const [isLoading, setIsLoading] = useState(true);
  const authUser = useContext(AuthUserContext);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    firebase?.user(userUID).on('value', (snapShot) => {
      setUserProfile(convertToUserProfile(snapShot, userUID));
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
  return (
    <div className="mainRoot">
      <Paper elevation={3} className="mainContainer">
        <Grid container direction="column" className={classes.gridContainer}>
          <Grid item>
            <AccountInfo userProfile={userProfile} />
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
          <Grid container item className={classes.centerTextAlign}>
            {tabIndex === 0 && <NewsFeed userProfile={userProfile} />}
            {tabIndex === 1 && (
              <Grid container item className={classes.centerContent}>
                {!userProfile.followings && (
                  <h1>Discover your friends by using SocialSpace Search</h1>
                )}
                {userProfile.followings &&
                  userProfile.followings.map((following) => (
                    <UserInfo
                      key={following.userUID}
                      userUID={following.userUID}
                      setTabIndex={setTabIndex}
                    />
                  ))}
              </Grid>
            )}
            {tabIndex === 2 && (
              <Grid container item className={classes.centerContent}>
                {!userProfile.followers && <h1>You have no followers :(</h1>}
                {userProfile.followers &&
                  userProfile.followers.map((follower) => (
                    <UserInfo
                      key={follower.userUID}
                      userUID={follower.userUID}
                      setTabIndex={setTabIndex}
                    />
                  ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};
