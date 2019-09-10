import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Iframe from 'react-iframe'
import { withStyles } from '@material-ui/core/styles';

import Host from './Host.js';
import ws_client from './WebSocketClient.js';
import MagicModeMarker from './MagicModeMarker.js';

const styles = theme => ({
  flex: {
    display: 'flex',
  },
  centerFlex: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
  },
  center: {
    alignItems: 'center',
    textAlign: 'center',
  },
})

class Player extends Component {
    
    constructor(props){
        super(props);

        this.state = {
            currentlyPlaying: null,
        }


        ws_client.subscribe("set.current_song", (data)=>{
            this.setState({
                currentlyPlaying: data.payload.song,
            });
        })

        ws_client.subscribe("get.current_song", (data)=>{
            this.setState({
                currentlyPlaying: data.payload,
            });
        })

        ws_client.subscribe("set.skip", () => {
            this.setState({
                currentlyPlaying: null,
            });
        })

        ws_client.registerInitHook(()=>{
            ws_client.send({type:"command", key:"get.current_song"});
        });

        document.body.style.backgroundColor = "#000";
        document.body.style.text = "#fff";
        var all = document.getElementsByTagName("*");

        for (var i=0, max=all.length; i < max; i++) {
         all[i].style.color = "#fff";
        }
    }

    render() {
        const { classes, theme } = this.props;

        let textContent
        
        if (this.state.currentlyPlaying === null){
            textContent = <em className={classes.center}>There is nothing playing. Go to {Host} to request a song.</em>
        }
        else{
            textContent = (
                <div style={{"text-align": "center"}}>
                    <span style={{"font-size": "1.5em"}}>{this.state.currentlyPlaying.title}</span>
                    { this.state.currentlyPlaying.auto_queued && <div><br/><MagicModeMarker/></div> }
                </div>
            )
        }
        var content 

        return (
            <div>
                { this.state.currentlyPlaying !== null && 
                        <Iframe  width="100%" height="800" url={this.state.currentlyPlaying.autoplay_url} frameborder="0" display="flex" position="relative" allow="autoplay" allowfullscreen/>
                }   
                { textContent }
                <br/>
            </div>
        );
    }
}

Player.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(Player);
