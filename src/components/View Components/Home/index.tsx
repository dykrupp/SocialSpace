import React, { useContext } from 'react';
import NewsFeed from '../../Reusable Components/NewsFeed';
import { Grid, makeStyles } from '@material-ui/core';
import { AuthUserContext } from '../../Authentication/AuthProvider/context';
import PropTypes from 'prop-types';
import { UserProfileUID } from '../../../utils/constants/interfaces';

interface HomeProps {
  users: UserProfileUID[];
}

const useStyles = makeStyles(() => ({
  root: {
    marginTop: '0px',
  },
}));

export const Home: React.FC<HomeProps> = ({ users }) => {
  const authUser = useContext(AuthUserContext);
  const classes = useStyles();

  if (!authUser) return null;
  return (
    <div className="mainRoot">
      <Grid container className={`mainContainer ${classes.root}`}>
        <NewsFeed userProfile={null} users={users} />
      </Grid>
    </div>
  );
};

Home.propTypes = {
  users: PropTypes.array.isRequired,
};
