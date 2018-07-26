import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import PauseIcon from '@material-ui/icons/Pause';

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


class PlayPause extends Component {
    
    constructor(props){
        super(props);
        this.ws = props.ws
        this.props = props;

        this.state = {
            playing: true
        }

        ws_client.subscribe("toggle.play_pause", data => {
            // update playback state
            this.setState({
                playing: !this.state.playing

            })
        });


       ws_client.registerInitHook(()=>{
            ws_client.send({type:"command", key:"get.play_pause"});
        });
    }

    
    sendSkipSong(){
        ws_client.send({
            type: "command",
            key: "set.skip", 
            details: {}
        }, true);
    }

    sendTogglePlayPause(){
        ws_client.send({
            type: "command",
            key: "toggle.play_pause"
        }, true);
    }


    render(){
        const { classes, theme } = this.props;
        return (
            <div className={classes.controls}>
                 <IconButton aria-label="Previous" onClick={()=>alert("Looked uneaven without a previous arrow... :)")} >
                  {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                </IconButton>
                <IconButton aria-label="Play/pause" onClick={this.sendTogglePlayPause}>
                 {this.state.playing ? <PauseIcon className={classes.playIcon} /> : <PlayArrowIcon className={classes.playIcon} /> }
                </IconButton>
                <IconButton aria-label="Next" onClick={this.sendSkipSong}>
                  {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
                </IconButton>
            </div>
        )
    }
}

PlayPause.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(PlayPause);
