import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import withWidth from '@material-ui/core/withWidth';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

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


class Queue extends Component {
    
    constructor(props){
        super(props);
        this.props = props;

        this.state = {
            queue: [],
            showFullQueue: false
        }

        ws_client.subscribe("get.queue", data=>{
            this.setState({
                queue: data.payload
            });

        });
        
        ws_client.subscribe("add.queue", data=>{
            let queue = this.state.queue.slice();
            queue.push(data.details);
            this.setState({
                queue: queue
            });
        })

        ws_client.subscribe("remove.queue", ()=>{
            this.setState({
              queue: []
            });
        });
        

        
       ws_client.registerInitHook(()=>{
            ws_client.send({type:"command", key:"get.queue"});
        });
    }

    detectSmallScreen = () => {
        return this.props.width === "sm" || this.props.width === "xs"
    }

    htmlDecode = (input) => {
        var doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    }

    toggleFullQueue = () => {
      this.setState({
        showFullQueue: !this.state.showFullQueue
      })
    }

  getQueue = () => {
    if (this.state.showFullQueue){
      return this.state.queue
    }
    return this.state.queue.slice(0, 10)
  }

    render(){
        const { classes, theme } = this.props;
        return (
           <Card className={classes.card}>
               <div className={classes.details}>
                    <CardContent className={classes.content}  >
                        <Typography variant="headline" component="h2">
                          Queue
                        </Typography>
                        { this.state.queue.length === 0 &&
                            <Typography component="p">
                                Nothing in queue.
                            </Typography>
                        }

                        <List style={{maxHeight:"800px", overflowY: "auto"}}>        
                            {this.getQueue().map((el,idx)=>{
                                return (
                                    <div>
                                        <ListItem spacing={5} key={el.id} button component="a" href={"https://youtube.com/watch?v="+el.id} target="_blank">
                                            <span><b>{String(idx+1) + ". "}</b></span>
                                            { !this.detectSmallScreen() &&
                                                <img src={el.thumbnail.url} className={classes.thumbnail}/>
                                            }
                                            { !this.detectSmallScreen() &&
                                                <span>{"| "}</span>
                                            }
                                            <ListItemText primary={this.htmlDecode(el.title)} />
                                            { !this.detectSmallScreen() &&
                                                <FavoriteButton song={el}/>
                                            }
                                        </ListItem>
                                        { this.detectSmallScreen() &&
                                            <FavoriteButton song={el}/>
                                        }
                                    </div>
                                )
                            })}
                        </List>
                    { this.state.queue.length > 10 &&
                      <div><br/><Button primary onClick={()=>this.toggleFullQueue()}>
                        { !this.state.showFullQueue && <span>Show Full Queue ({this.state.queue.length-10} more)</span> }
                        { this.state.showFullQueue && <span>Hide Full Queue </span> }
                      </Button></div>
                    }
                    </CardContent>
                </div>
            </Card>
        )
    }
}

Queue.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withWidth()(withStyles(styles)(Queue));
