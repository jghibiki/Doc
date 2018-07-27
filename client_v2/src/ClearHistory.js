import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

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
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
});


class ClearHistory extends Component {
    
    constructor(props){
        super(props);
        this.ws = props.ws
        this.props = props;

    }

	sendClearHistory(){
        ws_client.send({
            type: "command",
            key: "remove.history"
        }, true);
	}


    render(){
        const { classes, theme } = this.props;
        return (
            <Button className={classes.button} aria-label="Delete" color="primary">
              <DeleteIcon onClick={this.sendClearHistory} className={classNames(classes.leftIcon, classes.iconSmall)}/>
             Clear History
            </Button>
        )
    }
}

ClearHistory.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClearHistory);
