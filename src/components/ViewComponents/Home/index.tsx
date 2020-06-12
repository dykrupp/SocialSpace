import React, { useContext } from 'react';
import NewsFeed from '../../NewsFeed';
import { Grid } from '@material-ui/core';
import { AuthUserContext } from '../../Authentication/AuthProvider/context';

const Home: React.FC = () => {
  const authUser = useContext(AuthUserContext);

  if (!authUser) return null;
  return (
    <div className="mainRoot">
      <Grid container className="mainContainer" style={{ marginTop: '0px' }}>
        <NewsFeed userProfile={null} userUID={authUser.uid} />
      </Grid>
    </div>
  );
};

export default Home;
