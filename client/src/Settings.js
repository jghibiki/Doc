import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import Dialog from '@material-ui/core/Dialog';

import ColorTool from './ColorPicker.js';
import Fun from './Fun.js';

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
  appBar: {
    position: 'relative',
  },
});


class Settings extends Component {
    
    constructor(props){
        super(props);
        this.props = props;

        this.state = {
            open: false,

        };
    }

    handleClose = () => {
        this.setState({ open: false });
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };





    render(){
        const { classes, theme } = this.props;
        return (
            <div>
                <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.handleClickOpen}>
                  <SettingsApplicationsIcon />
                </IconButton>
                <Dialog
                    fullScreen
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <List>
                        <ListItem>
                            <ColorTool />
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <Fun />
                        </ListItem>
                        <ListItem button>
                        </ListItem>
                    </List>
                </Dialog>
            </div>
        )
    }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(Settings);
