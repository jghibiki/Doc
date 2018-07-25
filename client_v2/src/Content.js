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

const styles = theme => ({
  root: {
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
            <Grid container direction="column">
                <Grid item>
                    <Grid container spacing={16}>

                        <Grid item xs={4} >
                            <Grid container direction="column" spacing={16}>
                                <Grid item >
                                    <CurrentlyPlaying />
                                </Grid>

                                <Grid item >
                                    <PlaybackControls />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={8}>
                            <Grid container spacing={16}>
                                <Grid item xs={4} >
                                    <Queue />
                                </Grid>

                                <Grid item xs={4} >
                                    <History />
                                </Grid>

                                <Grid item xs={4} >
                                    <Favorites />
                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
  }

}

export default withStyles(styles)(Content);
