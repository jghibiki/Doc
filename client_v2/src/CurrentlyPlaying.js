
import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
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
           <Card className="CurrentlyPlaying">
                <CardContent>
                    <Typography variant="headline" component="h2">
                      Currently Playing
                    </Typography>
                    <Typography component="p">
                       todo 
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}


export default withStyles(styles)(CurrentlyPlaying);
