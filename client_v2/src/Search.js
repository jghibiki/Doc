import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';

import SearchDialog from './SearchDialog.js';
import ws_client from './WebSocketClient.js';

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


class Search extends Component {
    
    constructor(props){
        super(props);
        this.ws = props.ws
        this.props = props;

        this.state = {
            openDialog: false,
            searchResults: [],
        }

        ws_client.subscribe("get.search", results=>{
            this.setState({
                searchResults: results.payload,
                openDialog: true,
                query: "",
            });
        });
    }


    handleClose = value => {
        this.setState({  openDialog: false });
    };

    handleChange = event => {
        this.setState({
             query: event.target.value,
        });
    };

    sendSearch = (event) => {
        event.preventDefault()
        event.stopPropagation()

        ws_client.send({
            type: "command",
            key: "get.search",
            details: {
                query: this.state.query
            }
        })
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
                        <form onSubmit={this.sendSearch}>
                            <span>
                                <TextField
                                    id="name"
                                    label="Search Query"
                                    className={classes.textField}
                                    value={this.state.query}
                                    onChange={this.handleChange}
                                    margin="normal"
                                />
                                <Button type="submit" color="primary" className={classes.button} >
                                    <SearchIcon className={classNames(classes.leftIcon, classes.iconSmall)}/> 
                                    Search
                                </Button>
                            </span>
                        </form>
                    </CardContent>
                    <SearchDialog open={this.state.openDialog} onClose={this.handleClose} searchResults={this.state.searchResults} searchQuery={this.state.query}/>
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
