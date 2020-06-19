import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import { UserInfo } from './UserInfo';

const useStyles = makeStyles(() => ({
  centerTextAlign: {
    textAlign: 'center',
  },
  userInfoContainer: {
    alignContent: 'center',
    margin: '10px',
  },
  paper: {
    marginTop: '25px',
  },
}));

interface UserListProps {
  userUIDS: string[];
  setTabIndex: (index: number) => void;
  emptyListString: string;
}

export const UserList: React.FC<UserListProps> = ({
  userUIDS,
  setTabIndex,
  emptyListString,
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
              <UserInfo userUID={userUID} setTabIndex={setTabIndex} />
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
};
