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
import { UserList } from './UserList';
import {
  convertToUserProfile,
  getFirstName,
} from '../../../utils/helperFunctions';

const useStyles = makeStyles(() => ({
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
          {tabIndex === 0 && <NewsFeed userProfile={userProfile} />}
          {tabIndex === 1 && (
            <UserList
              userUIDS={userProfile.followings.map(
                (following) => following.userUID
              )}
              setTabIndex={setTabIndex}
              emptyListString="Discover new friends with SocialSpace Search!"
            />
          )}
          {tabIndex === 2 && (
            <UserList
              userUIDS={userProfile.followers.map(
                (follower) => follower.userUID
              )}
              setTabIndex={setTabIndex}
              emptyListString={`${getFirstName(
                userProfile.fullName
              )} could use some friends...`}
            />
          )}
        </Grid>
      </Paper>
    </div>
  );
};
