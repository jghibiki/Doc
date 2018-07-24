import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material referances
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import WebSocketClient from './WebSocketClient.js';
import Host from './Host.js';
import CurrentlyPlaying from './CurrentlyPlaying.js';
import PlaybackControls from './PlaybackControls.js';

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
    this.ws_client = new WebSocketClient();
    this.ws_client.init(Host, "8081");

  }

  render(){
    return (
        <div className="content">
            <Grid container spacing={16}>
                <Grid item>
                    <CurrentlyPlaying />
                </Grid>
                <Grid item>
                    <PlaybackControls />
                </Grid>
            </Grid>
        </div>
    )
  }

}

export default withStyles(styles)(Content);
