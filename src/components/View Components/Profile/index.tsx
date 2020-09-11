// eslint-disable-next-line
import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { UserProfileUID } from '../../../constants/interfaces';
import { AuthUserContext } from '../../Authentication/AuthProvider/context';
import { AccountInfo } from './AccountInfo';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import { Grid } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import ReceiptIcon from '@material-ui/icons/Receipt';
import PeopleIcon from '@material-ui/icons/People';
import NewsFeed from '../../Reusable Components/NewsFeed';
import { UserList } from './UserList';
import PropTypes from 'prop-types';
import { getFirstName } from '../../../utils/helperFunctions';

interface ProfileProps {
  users: UserProfileUID[];
}

interface ParamTypes {
  userUID: string;
}

const useStyles = makeStyles(() => ({
  gridContainer: {
    padding: '20px',
  },
  dividerItem: {
    marginTop: '5px',
  },
}));

export const Profile: React.FC<ProfileProps> = ({ users }) => {
  const classes = useStyles();
  const { userUID } = useParams<ParamTypes>();
  const authUser = useContext(AuthUserContext);
  const [tabIndex, setTabIndex] = useState(0);
  const userProfile = users.find((x) => x.uid === userUID);

  const handleChange = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ): void => {
    setTabIndex(newValue);
  };

  if (!userProfile || !authUser) return null;
  return (
    <div className="mainRoot">
      <Paper elevation={3} className="mainContainer">
        <Grid container direction="column" className={classes.gridContainer}>
          <Grid item>
            <AccountInfo userProfile={userProfile} />
          </Grid>
          <Grid className={classes.dividerItem} item>
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
          {tabIndex === 0 && (
            <NewsFeed userProfile={userProfile} users={users} />
          )}
          {tabIndex === 1 && (
            <UserList
              userUIDS={
                userProfile.followings
                  ? userProfile.followings.map((following) => following.userUID)
                  : []
              }
              users={users}
              setTabIndex={setTabIndex}
              emptyListString="Discover new friends with SocialSpace Search!"
            />
          )}
          {tabIndex === 2 && (
            <UserList
              userUIDS={
                userProfile.followers
                  ? userProfile.followers.map((follower) => follower.userUID)
                  : []
              }
              users={users}
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

Profile.propTypes = {
  users: PropTypes.array.isRequired,
};
