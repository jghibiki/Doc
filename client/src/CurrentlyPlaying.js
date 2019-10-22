import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Link from '@material-ui/core/Link';


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


class CurrentlyPlaying extends Component {
    
    constructor(props){
        super(props);
        this.props = props;

        this.tickerTapeTimer = null;
        this.tickerTapeCounter = 0;

        this.state = {
            currentlyPlaying: null,
            progress: -1,
            startDate: null,
            duration: null,
        };

        ws_client.subscribe("set.current_song", (data)=>{
            if(data.payload.song !== null && data.payload.song !== undefined){

                var startDate = Date.parse(data.payload.song.played_at);
                var endDate = Date.parse(data.payload.song.ends_at);
                var clientSideDate = Date.now();

                var offset = clientSideDate - startDate
                console.log("client offset", offset)

                var duration = (endDate+offset) - startDate;

                notify.show("Now Playing: " + data.payload.song.title);
            }
            else{
                var startDate = null
                var endDate = null
                var duration: null
            }

            this.setState({
                currentlyPlaying: data.payload.song,
                startDate: startDate,
                duration: duration,
                progress: -1
            });

            if(this.progressTimer !== null){
                clearTimeout(this.progressTimer);
                this.progressTimer = null;
            }
            this.progressTimer = setInterval(this.updateProgressBar.bind(this), 250)

            if(this.tickerTapeTimer === null && this.state.currentlyPlaying !== null){
                this.tickerTapeTimer = setInterval(this.ticker_tape, 250)
            }
            else{
                this.state.tickerTapeCounter = 0;
            }
        });

        ws_client.subscribe("get.current_song", (data)=>{
            if(data.payload !== null && data.payload !== undefined){

                var startDate = Date.parse(data.payload.played_at);
                var endDate = Date.parse(data.payload.ends_at);
                var duration = endDate - startDate;

                notify.show("Now Playing: " + data.payload.title);
            }
            else{
                var startDate = null
                var endDate = null
                var duration: null
            }

            // fix title
            if(data.payload !== null){
              data.payload.title = this.htmlDecode(data.payload.title)
            }

            this.setState({
                currentlyPlaying: data.payload,
                startDate: startDate,
                duration: duration,
                progress: -1
            });

            if(this.progressTimer !== null){
                clearTimeout(this.progressTimer);
                this.progressTimer = null;
            }
            this.progressTimer = setInterval(this.updateProgressBar.bind(this), 250)

            if(this.tickerTapeTimer === null && this.state.currentlyPlaying !== null){
                this.tickerTapeTimer = setInterval(this.ticker_tape, 250)
            }
            else{
                this.state.tickerTapeCounter = 0;
            }
3       });

        ws_client.subscribe("set.skip", () => {
            this.setState({
                currentlyPlaying: null,
                duration: null,
                startDate: null,
            });
            clearTimeout(this.tickerTapeTimer);
            this.tickerTapeTimer = null;
            this.tickerTapeCounter = 0;
            document.title = "Doc";

        });

       ws_client.registerInitHook(()=>{
            ws_client.send({type:"command", key:"get.current_song"});
        });
    }


    htmlDecode = (input) => {
        var doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    }

    ticker_tape = () => {
        if (this.tickerTapeCounter >= this.state.currentlyPlaying.title.length){
            this.tickerTapeCounter = -5;
        }

        if(this.tickerTapeCounter < 0){
            document.title = "Doc: " + this.state.currentlyPlaying.title;
            this.tickerTapeCounter += 1
            return
        }

        document.title = "Doc: " + this.state.currentlyPlaying.title.substring(this.tickerTapeCounter, this.state.currentlyPlaying.title.length);

        this.tickerTapeCounter += 1
    }

    updateProgressBar = () => {
        if(this.state.duration === null){
            this.setState({
                progress: -1
            });
            clearTimeout(this.progressTimer);
            this.progressTimer = null;
            return
        }

        var value = (( Date.now()-this.state.startDate )/this.state.duration)*100
        var clip = Math.min(value, 100.0)


        this.setState({
          progress: clip   })

    }

    render(){
        const { classes, theme } = this.props;
        return (
           <Card className={classes.card}>
               <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography variant="headline" component="h2">
                          Currently Playing
                        </Typography>
                        { this.state.currentlyPlaying === null && <div>
                            <Typography component="h2">
                                <em>Nothing is currently playing</em>
                            </Typography>
                        </div>}
                        { this.state.currentlyPlaying !== null && <div>
                            <Typography component="h2">
                                { this.state.currentlyPlaying !== null && this.state.currentlyPlaying.title} 
                                &nbsp;({this.state.currentlyPlaying !== null && <Link href={"https://youtube.com/watch?v="+this.state.currentlyPlaying.id} target="_blank">Link</Link>})
                            </Typography>
                            <img src={this.state.currentlyPlaying !== null && this.state.currentlyPlaying.thumbnail.url} style={{"width": "80%"}}/>
                        </div>}
                        { this.state.progress >= 0 &&  <LinearProgress variant="determinate" value={this.state.progress} /> }                        
                        <br/>
                        { (this.state.currentlyPlaying !== null && this.state.currentlyPlaying.auto_queued) && <MagicModeMarker/> }
                    </CardContent>
                </div>
            </Card>
        )
    }
}

CurrentlyPlaying.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(CurrentlyPlaying);
