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

import RequestButton from './RequestButton.js';
import FavoriteButton from './FavoriteButton.js';
import ws_client from './WebSocketClient.js';
import MagicModeMarker from './MagicModeMarker.js';

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

    detectSmallScreen = () => {
        return this.props.width === "sm" || this.props.width === "xs"
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
                            {this.state.history.map((el,idx)=>{
                                return (
                                    <div>
                                        <ListItem spacing={5} key={el.id} button component="a" href={"https://youtube.com/watch?v="+el.id} target="_blank">
                                            <span><b>{String(idx+1) + ". "}</b></span>
                                            { !this.detectSmallScreen() &&
                                                <span>{"| "}</span>
                                            }
                                            { !this.detectSmallScreen() &&
                                                <img src={el.thumbnail.url} className={classes.thumbnail}/>
                                            }
                                            <ListItemText primary={el.title} />
                                            { !this.detectSmallScreen() &&
                                                <div> 
                                                    { el.auto_queued && <MagicModeMarker/>} 
                                                </div>
                                            }
                                            { !this.detectSmallScreen() &&
                                                <RequestButton song={el}/>
                                            }
                                            { !this.detectSmallScreen() &&
                                                <FavoriteButton song={el}/>
                                            }
                                        </ListItem>
                                        { this.detectSmallScreen() &&
                                            <div>
                                                { el.auto_queued && <MagicModeMarker/>}
                                                <div>
                                                    <RequestButton song={el}/>
                                                    <FavoriteButton song={el}/>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                )
                            }).slice(Math.max(0, this.state.history.length-11), this.state.history.length).reverse()}
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

export default withWidth()(withStyles(styles)(History));
