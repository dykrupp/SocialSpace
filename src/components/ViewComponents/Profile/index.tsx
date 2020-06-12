/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';
import { convertToUserProfile } from '../../../utils/helperFunctions';
//TODO -> Add profile images to Links
//TODO -> Break Link out into its own component

const useStyles = makeStyles(() => ({
  gridContainer: {
    padding: '20px',
  },
  centerTextAlign: {
    textAlign: 'center',
  },
  centerContent: {
    justifyContent: 'center',
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
    firebase?.user(userUID).on('value', async (snapShot) => {
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
            {tabIndex === 0 && (
              <NewsFeed userProfile={userProfile} userUID={userProfile.uid} />
            )}
            {tabIndex === 1 && (
              <Grid container item className={classes.centerContent}>
                {!userProfile.followings && (
                  <h1>Discover your friends by using SocialSpace Search</h1>
                )}
                {userProfile.followings &&
                  userProfile.followings.map((following) => (
                    <Link
                      className={classes.link}
                      key={following.userUID}
                      to={`${ROUTES.PROFILE}/${following.userUID}`}
                      onClick={(): void => setUserProfile((profile) => profile)}
                    >
                      {following.fullName}
                    </Link>
                  ))}
              </Grid>
            )}
            {tabIndex === 2 && (
              <Grid container item className={classes.centerContent}>
                {!userProfile.followers && <h1>You have no followers :(</h1>}
                {userProfile.followers &&
                  userProfile.followers.map((follower) => (
                    <Link
                      className={classes.link}
                      key={follower.userUID}
                      to={`${ROUTES.PROFILE}/${follower.userUID}`}
                      onClick={(): void => setUserProfile((profile) => profile)}
                    >
                      {follower.fullName}
                    </Link>
                  ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};
