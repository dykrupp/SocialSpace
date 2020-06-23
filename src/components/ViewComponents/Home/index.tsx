import React, { useContext } from 'react';
import NewsFeed from '../../NewsFeed';
import { Grid } from '@material-ui/core';
import { AuthUserContext } from '../../Authentication/AuthProvider/context';
import PropTypes from 'prop-types';
import { UserProfileUID } from '../../../constants/interfaces';

interface HomeProps {
  users: UserProfileUID[];
}

export const Home: React.FC<HomeProps> = ({ users }) => {
  const authUser = useContext(AuthUserContext);

  if (!authUser) return null;
  return (
    <div className="mainRoot">
      <Grid container className="mainContainer" style={{ marginTop: '0px' }}>
        <NewsFeed userProfile={null} users={users} />
      </Grid>
    </div>
  );
};

Home.propTypes = {
  users: PropTypes.array.isRequired,
};
