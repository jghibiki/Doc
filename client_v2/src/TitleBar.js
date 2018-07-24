import React from 'react';
import PropTypes from 'prop-types';

// Material referances
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    flexGrow: 1,
  },
};

function TitleBar(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="title" color="inherit">
            Doc Music Player
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

TitleBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TitleBar);
