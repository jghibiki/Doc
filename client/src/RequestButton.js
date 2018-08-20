import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';     


import ws_client from './WebSocketClient.js';

const styles = theme => ({
});


class RequestButton extends Component {
    
    constructor(props){
        super(props);
        this.props = props;

        this.song = props.song;

    }

    sendRequest(){
        ws_client.send({
            type: "command",
            key: "add.queue", 
            details: this.song 
        }, true);
    }

    render(){
        const { classes, theme } = this.props;
        return (
            <Button primary onClick={()=>this.sendRequest()}>
                Request
            </Button>
        )
    }
}

RequestButton.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(RequestButton);
