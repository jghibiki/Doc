import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';



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


class RemoveFavoriteCollectionDialog extends Component {

    constructor(props){
        super(props);
        this.props = props;

        this.state = {
            value: ""
        }

    }


    handleChange = (event) => {
        this.setState({ value: event.target.value});
    };
    

    handleCancel = () => {
        this.props.onClose(this.props.favorites);
    };

    handleOk = () => {
        var favorites = this.props.favorites

        if(this.state.value !== ""){

            for(var i=0; i<favorites.length; i++){
                if(favorites[i].name === this.state.value){
                    favorites.splice(i, 1);
                }
            }

            this.setState({value: ""})
        }

        this.props.onClose(favorites);
    };

    render(){
        const { classes, favorites, ...other } = this.props;

        return (
            <Dialog onClose={this.handleOnClose} {...other} maxWidth="md" onEntering={this.handleEntering}>
                <DialogTitle id="simple-dialog-title">Move favorite:</DialogTitle>
                <DialogContent>
                    <div className={classes.details}>
                        <RadioGroup
                             ref={ref => {
                               this.radioGroupRef = ref;
                             }}
                             aria-label="Ringtone"
                             name="ringtone"
                             value={this.state.value}
                             onChange={this.handleChange}
                        >
                        {favorites.map(option => (
                            <FormControlLabel value={option.name} key={option.key} control={<Radio />} label={option.name} />
                        ))}
                      </RadioGroup>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleOk} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

RemoveFavoriteCollectionDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(RemoveFavoriteCollectionDialog);

