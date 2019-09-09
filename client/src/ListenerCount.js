import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';


import ws_client from './WebSocketClient.js';
import MagicModeMarker from './MagicModeMarker.js';
import notify from './NotificationService.js';

const styles = theme => ({
  card: {
    alignItems: 'center',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  content: {
    flex: '1 0 auto',
    alignItems: 'center',
  },
});


class ListenerCount extends Component {
    
    constructor(props){
        super(props);
        this.props = props;

        this.state = {
            listener_count: 0,
        };

        ws_client.subscribe("get.listener_count", (data)=>{
          this.setState({listener_count: Math.max(0, data.payload-1)})
        });

       ws_client.registerInitHook(()=>{
            ws_client.send({type:"command", key:"get.listener_count"});
        });
    }

    render(){
        const { classes, theme } = this.props;
        return (
          <div>
            <b>Current Listeners: </b>{this.state.listener_count}&nbsp;&nbsp;
          </div>
        )
    }
}

ListenerCount.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListenerCount);
