import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

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


class MagicMode extends Component {
    
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
            <FormGroup row className={classes.magicMode}>
                <FormControlLabel control={
                    <Switch
                      value="magic_mode_enabled"
                      checked={this.state.magic_mode_enabled}
                      onChange={this.handleToggle()}
                      color="primary"
                    />
                  }
                  label="Magic Mode"
                />
                <FormControlLabel control={
                    <IconButton className={classes.button} aria-label="Delete" color="primary">
                      <DeleteIcon />
                    </IconButton>
                }
                label="Clear History"
                />
            </FormGroup>
        )
    }
}

MagicMode.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(MagicMode);
