import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';

const styles = theme => ({
  card: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    height: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  playIcon: {
    height: 38,
    width: 38,
  },
});
class PlaybackControls extends Component {
    
    constructor(props){
        super(props);
        this.ws = props.ws
        this.theme = props.theme
    }

    render(){
        return (
           <Card className="PlaybackControls">
                <CardContent>
                    <Typography variant="headline" component="h2">
                      Currently Playing
                    </Typography>
                    <Typography component="p">
                       todo 
                    </Typography>
                </CardContent>
                <div className="PlaybackControlsControls">
                    <IconButton aria-label="Previous">
                      {this.theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                    </IconButton>
                    <IconButton aria-label="Play/pause">
                      <PlayArrowIcon className="playIcon" />
                    </IconButton>
                    <IconButton aria-label="Next">
                      {this.theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
                    </IconButton>
                </div>
            </Card>
        )
    }
}


export default withStyles(styles)(PlaybackControls);
