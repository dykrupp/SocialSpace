import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

//TODO -> Continue work here -> Make UI for media and status -> timestamp & user required

interface PostProps {
  post: string;
}

const useStyles = makeStyles(() => ({
  paper: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    width: '500px',
    margin: '0 auto',
    padding: '20px',
  },
}));

const Post: React.FC<PostProps> = ({ post }) => {
  const classes = useStyles();

  return (
    <Paper elevation={3} className={classes.paper}>
      <Typography variant="h3">{post}</Typography>
    </Paper>
  );
};

Post.propTypes = {
  post: PropTypes.string.isRequired,
};

export default Post;
