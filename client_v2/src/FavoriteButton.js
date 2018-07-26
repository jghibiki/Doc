import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';     


const styles = theme => ({
});


class RequestButton extends Component {
    
    constructor(props){
        super(props);
        this.props = props;

        this.song = props.song;

    }

    addOrRemoveFavorite(){
        //TODO toggle display of add/remove based on if the song is a favorite
    }

    render(){
        const { classes, theme } = this.props;
        return (
            <Button primary onClick={()=>this.addOrRemoveFavorite()}>
                Add Favorite 
            </Button>
        )
    }
}

RequestButton.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(RequestButton);
