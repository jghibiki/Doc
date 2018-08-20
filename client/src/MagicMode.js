import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';

import ws_client from './WebSocketClient.js';

var styles = theme => ({
  magicMode: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
});


class MagicMode extends Component {
    
    constructor(props){
        super(props);
        this.ws = props.ws
        this.props = props;

        this.state = {
            magic_mode_enabled: false,
        };


        ws_client.subscribe("toggle.magic_mode", data=>{
            this.setState({
                magic_mode_enabled: !this.state.magic_mode_enabled
            })
        });

        ws_client.subscribe("get.magic_mode", data=>{
            this.setState({
                magic_mode_enabled: data.payload.magic_mode
            })
        });

       ws_client.registerInitHook(()=>{
            ws_client.send({type:"command", key:"get.magic_mode"});
        });
    }

	sendMagicModeToggle(){
        ws_client.send({
            type: "command",
            key: "toggle.magic_mode"
        }, true);
	}

    render(){
        const { classes, theme } = this.props;
        return (
            <FormControlLabel control={
                <Switch
                  value="magic_mode_enabled"
                  checked={this.state.magic_mode_enabled}
                  onChange={this.sendMagicModeToggle}
                  color="primary"
                />
              }
              label="Magic Mode"
            />
        )
    }
}

MagicMode.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(MagicMode);
