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
import Divider from '@material-ui/core/Divider';

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


class Search extends Component {

    constructor(props){
        super(props);
        this.ws = props.ws
        this.props = props;
    }

    handleClose = () => {
        this.props.onClose(this.props.selectedValue);
    };
    
    handleListItemClick = value => {
        this.props.onClose(value);
    };

  htmlDecode = (input) => {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }

    detectSmallScreen = () => {
        return this.props.width === "sm" || this.props.width === "xs"
    }

    render(){
        const { classes, searchQuery, searchResults, onClose, selectedValue, ...other } = this.props;

        return (
            <Dialog onClose={this.handleOnClose} {...other} maxWidth="md" fullScreen={this.detectSmallScreen()}>
                <DialogTitle id="simple-dialog-title">Search results for: {searchQuery}</DialogTitle>
                <DialogContent>
                    <div className={classes.details}>
                        <List>
                            {searchResults !== undefined && searchResults.map((el,idx)=>{
                                return (
                                    <div>
                                        <ListItem spacing={5} key={el.id}>
                                            <span><b>{String(idx+1) + ". "}</b></span>
                                            &nbsp;
                                            { !this.detectSmallScreen() &&
                                                <img src={el.thumbnail.url} className={classes.thumbnail}/>
                                            }
                                            &nbsp;
                                            <ListItemText primary={this.htmlDecode(el.title)} />
                                            { !this.detectSmallScreen() &&
                                                <RequestButton song={el}/>
                                            }
                                            &nbsp;
                                            &nbsp;
                                            &nbsp;
                                            { !this.detectSmallScreen() &&
                                                <FavoriteButton song={el}/>
                                            }
                                        </ListItem>
                                        { this.detectSmallScreen() &&
                                            <div>
                                                <RequestButton song={el}/>
                                                <FavoriteButton song={el}/>
                                            </div>
                                        }
                                        { idx !== searchResults.length-1 && <Divider/>}
                                    </div>
                                )
                            })}
                        </List>
                    </div>
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

Search.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withWidth()(withStyles(styles)(Search));
