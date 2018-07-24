
import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({

});


class CurrentlyPlaying extends Component {
    
    constructor(props){
        super(props);
        this.ws = props.ws
    }

    render(){
        return (
            <Paper className="CurrentlyPlaying" elevation={1}>
                <Typography variant="headline" component="h3">
                  Currently Playing
                </Typography>
                <Typography component="p">
                   todo 
                </Typography>
            </Paper>
        )
    }
}


export default withStyles(styles)(CurrentlyPlaying);
