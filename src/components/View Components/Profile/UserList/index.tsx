import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import { UserInfo } from './UserInfo';
import { UserProfileUID } from '../../../../utils/constants/interfaces';

const useStyles = makeStyles(() => ({
  centerTextAlign: {
    textAlign: 'center',
  },
  userInfoContainer: {
    alignContent: 'center',
    margin: '10px',
    width: '100%',
  },
  paper: {
    marginTop: '25px',
  },
}));

interface UserListProps {
  userUIDS: string[];
  setTabIndex: (index: number) => void;
  emptyListString: string;
  users: UserProfileUID[];
}

export const UserList: React.FC<UserListProps> = ({
  userUIDS,
  setTabIndex,
  emptyListString,
  users,
}) => {
  const classes = useStyles();
  return (
    <Paper elevation={3} className={classes.paper}>
      <Grid
        container
        direction="column"
        className={classes.userInfoContainer}
        spacing={4}
      >
        {userUIDS.length === 0 && (
          <Grid item className={classes.centerTextAlign}>
            <h1>{emptyListString}</h1>
          </Grid>
        )}
        {userUIDS.length > 0 &&
          userUIDS.map((userUID) => (
            <Grid item key={userUID}>
              <UserInfo
                userProfile={users.find((x) => x.uid === userUID)}
                setTabIndex={setTabIndex}
              />
            </Grid>
          ))}
      </Grid>
    </Paper>
  );
};

UserList.propTypes = {
  userUIDS: PropTypes.array.isRequired,
  setTabIndex: PropTypes.func.isRequired,
  emptyListString: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
};
