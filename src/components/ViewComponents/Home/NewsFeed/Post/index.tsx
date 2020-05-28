import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

//TODO -> Continue work here -> Make UI for media and status -> timestamp & user required

interface PostProps {
  post: string;
  username: string;
  dateTime: string;
  media: string;
}

const useStyles = makeStyles(() => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
  },
  gridRow: {
    display: 'flex',
  },
}));

const Post: React.FC<PostProps> = ({ post, username, dateTime, media }) => {
  const classes = useStyles();

  return (
    <Paper elevation={3} className={classes.paper}>
      <Grid container spacing={1}>
        <Grid item xs={12} className={classes.gridRow}>
          <p>{username}</p>
          <p style={{ marginLeft: '20px' }}>
            {new Date(Date.parse(dateTime)).toLocaleString()}
          </p>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">{post}</Typography>
        </Grid>
        <Grid item xs={12}>
          {media !== '' && (
            <img style={{ maxHeight: '250px' }} src={media} alt="postedMedia" />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

Post.propTypes = {
  post: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  dateTime: PropTypes.string.isRequired,
  media: PropTypes.any,
};

export default Post;
