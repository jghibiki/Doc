import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';

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
            magic_mode_enabled: false,
        };
    }

    handleToggle = () => event => {
        this.setState({ magic_mode_enabled: event.target.checked });
    }

    render(){
        const { classes, theme } = this.props;
        return (
            <div className={classes.controls}>
                 <IconButton aria-label="Previous">
                  {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                </IconButton>
                <IconButton aria-label="Play/pause">
                  <PlayArrowIcon className={classes.playIcon} />
                </IconButton>
                <IconButton aria-label="Next">
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
