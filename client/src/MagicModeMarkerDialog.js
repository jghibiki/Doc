import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import withWidth from '@material-ui/core/withWidth';
import Avatar from '@material-ui/core/Avatar';
import StarIcon from '@material-ui/icons/Star';

import RequestButton from './RequestButton.js';
import FavoriteButton from './FavoriteButton.js';

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
    thumbnail: {
      width: "5%"
    },
});


class MagicModeMarkerDialog extends Component {

    constructor(props){
        super(props);
        this.props = props;
    }

    handleClose = () => {
        this.props.onClose(this.props.selectedValue);
    };
    

    detectSmallScreen = () => {
        return this.props.width === "sm" || this.props.width === "xs"
    }

    render(){
        const { classes, video, onClose, selectedValue, ...other } = this.props;

        return (
            <Dialog onClose={this.handleOnClose} {...other} maxWidth="md" fullScreen={this.detectSmallScreen()}>
                <DialogTitle id="simple-dialog-title">Magic Mode History for "{video.title}"</DialogTitle>
                <DialogContent>
                    <List>
                        <ListItem>
                            <Avatar>
                                <StarIcon/>
                            </Avatar>
                            &nbsp;
                            &nbsp;
                            <ListItemText primary={video.title} secondary={video.played_at}/>
                            
                        </ListItem>

                        { video.magic_mode !== undefined && video.magic_mode.map( (vid, idx) => {
                                return (
                                    <ListItem >
                                        <Avatar>
                                            {video.magic_mode.length-idx}
                                        </Avatar>
                                        &nbsp;
                                        &nbsp;
                                        <ListItemText primary={vid.title} secondary={vid.played_at}/>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </DialogContent>
                 <DialogActions>
                     <Button onClick={this.handleClose} color="primary">
                         Close
                     </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

MagicModeMarkerDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withWidth()(withStyles(styles)(MagicModeMarkerDialog));
