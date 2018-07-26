import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

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


class Search extends Component {
    
    constructor(props){
        super(props);
        this.ws = props.ws
        this.props = props;
    }

    render(){
        const { classes, theme } = this.props;
        return (
           <Card className={classes.card}>
               <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography variant="headline" component="h2">
                          Search
                        </Typography>
                    </CardContent>
                </div>
            </Card>
        )
    }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(Search);
