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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/styles';
import Link from '@material-ui/core/Link';


import RequestButton from './RequestButton.js';
import FavoriteButton from './FavoriteButton.js';
import ws_client from './WebSocketClient.js';
import MagicModeMarker from './MagicModeMarker.js';

const useStyles = makeStyles({
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


const History = ()=> {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [history, setHistory] = React.useState([]);
    const classes = useStyles();
        

    ws_client.subscribe("get.history", data=>{
        setHistory(data.payload);
    });
    
    ws_client.subscribe("add.history", data=>{
        let _history = history.slice();
        _history.push(data.payload);
        setHistory(_history)         
    })

    ws_client.subscribe("remove.history", ()=>{
      setHistory([])
    });
    
   ws_client.registerInitHook(()=>{
        ws_client.send({type:"command", key:"get.history"});
    });


  const detectSmallScreen = () => {
      var width = withWidth()
      return width === "sm" || width === "xs"
  }

  const menuOpen = (event) =>{
    setAnchorEl(event.currentTarget); 
  }

  const menuClose = (event) =>{
    setAnchorEl(null);
  }

  return (
     <Card className={classes.card}>
         <div className={classes.details}>
              <CardContent className={classes.content}>
                  <Typography variant="headline" component="h2">
                      History
                  </Typography>
                  { history.length === 0 &&
                      <Typography component="p">
                          Nothing in history.
                      </Typography>
                  }

                  <List>        
                      {history.map((el,idx)=>{
                          return (
                              <div>
                                  <ListItem spacing={5} key={el.id} >
                                      <span><b>{String(idx+1) + ". "}</b></span>
                                      { !detectSmallScreen() &&
                                          <span>{"| "}</span>
                                      }
                                      { !detectSmallScreen() &&
                                          <img src={el.thumbnail.url} className={classes.thumbnail}/>
                                      }
                                      <ListItemText primary={el.title}  /> 
                                      
                                      { !detectSmallScreen() &&
                                          <div> 
                                              { el.auto_queued && <MagicModeMarker video={el}/>} 
                                          </div>
                                      }
                                      <IconButton aria-label="more"
                                        aria-controls="long-menu"
                                        aria-haspopup="true"
                                        aria-controls="simple-menu-{el.id}" 
                                        onClick={menuOpen}
                                      >
                                        <MoreVertIcon />
                                      </IconButton>
                                      <Menu id="simple-menu-{el.id}" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={menuClose}>
                                        <MenuItem onclick={menuClose}>
                                          <Link href={"https://youtube.com/watch?v="+el.id} target="_blank">
                                            Open on Youtube
                                          </Link>
                                        </MenuItem>
                                        <MenuItem>
                                          <RequestButton song={el}/>
                                        </MenuItem>
                                        <MenuItem>
                                          <FavoriteButton song={el}/>
                                        </MenuItem>
                                      </Menu>
                                  </ListItem>
                              </div>
                          )
                      }).slice(Math.max(0, history.length-11), history.length).reverse()}
                  </List>
              </CardContent>
          </div>
      </Card>
  )
}


export default History;
