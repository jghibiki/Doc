import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material referances
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Host from './Host.js';
import CurrentlyPlaying from './CurrentlyPlaying.js';
import PlaybackControls from './PlaybackControls.js';
import Queue from './Queue.js';
import History from './History.js';
import Favorites from './Favorites.js';
import Search from './Search.js';
import Volume from './Volume.js';
import Fun from './Fun.js';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});


class Content extends Component {

  constructor(props){
    super(props);
    this.props = props;
  }

  render(){
    const { classes } = this.props
    return (
        <div className={classes.control}>
            <Grid container spacing={2}>

                <Grid item xs={12} md={3} className={classes.flex}>
                    <Grid container className={classes.flex}>
                        <Grid item className={classes.flex}>
                            <Grid container direction="column" spacing={2}>
                                <Grid item >
                                    <CurrentlyPlaying />
                                </Grid>
                                <Grid item >
                                    <PlaybackControls />
                                </Grid>
                                <Grid item>
                                    <Search />
                                </Grid>
                                <Grid item >
                                    <Volume />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Grid container direction="column" spacing={2}>
                        <Grid item >
                            <Queue />
                        </Grid>

                        <Grid item >
                            <History />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item  xs={12} md={4}>
                    <Favorites />
                </Grid>
            </Grid>
            <Fun visibility="hidden" />
        </div>
    )
  }

}

export default withStyles(styles)(Content);
