import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import RequestButton from './RequestButton.js';
import FavoriteButton from './FavoriteButton.js';
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
  thumbnail: {
      width: "5%"
  },
});


class History extends Component {
    
    constructor(props){
        super(props);
        this.props = props;
        
        this.state = {
            history: [] }

        ws_client.subscribe("get.history", data=>{
            this.setState({
                history: data.payload
            });
        });
        
        ws_client.subscribe("add.history", data=>{
            let history = this.state.history.slice();
            history.push(data.payload);
            this.setState({
                history: history
            });
        })

        ws_client.subscribe("remove.history", ()=>{
            console.log("asdf");
            this.setState({
                history: []
            });
        });
        
       ws_client.registerInitHook(()=>{
            ws_client.send({type:"command", key:"get.history"});
        });


    }

    render(){
        const { classes, theme } = this.props;
        return (
           <Card className={classes.card}>
               <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography variant="headline" component="h2">
                            History
                        </Typography>
                        { this.state.history.length === 0 &&
                            <Typography component="p">
                                Nothing in history.
                            </Typography>
                        }

                        <List>        
                            {this.state.history.slice(1, 10).map((el,idx)=>{
                                return (
                                    <ListItem spacing={5}>
                                        <span><b>{String(idx+1) + ". "}</b></span>
                                        <img src={el.thumbnail.url} className={classes.thumbnail}/>
                                        <span>{"| "}</span>
                                        <ListItemText primary={el.title} />
                                        <RequestButton song={el}/>
                                        <FavoriteButton song={el}/>
                                    </ListItem>
                                )
                            }).reverse()}
                        </List>
                    </CardContent>
                </div>
            </Card>
        )
    }
}

History.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(History);
