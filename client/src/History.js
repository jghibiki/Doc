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
import Divider from '@material-ui/core/Divider';


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

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    
    const [playbackHistory, setPlaybackHistory] = React.useState([]);

    const [setupFlag, setSetupFlag] = React.useState(false);


    const get_history = data=>{
        setPlaybackHistory(data.payload);
    }

    const add_history = data=>{
        setPlaybackHistory(_h => [..._h, data.payload])
    }

    const remove_history = ()=>{
      setPlaybackHistory([])
    }
    
    React.useEffect(()=>{

       ws_client.subscribe("get.history", get_history);
       ws_client.subscribe("add.history", add_history)
       ws_client.subscribe("remove.history", remove_history);
        
       ws_client.registerInitHook(()=>{
            ws_client.send({type:"command", key:"get.history"});
        });

    }, [])


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
          <CardContent className={classes.content}>
             <div className={classes.details}>
                  <Typography variant="headline" component="h2">
                      History
                  </Typography>
                  { (playbackHistory === null || playbackHistory.length === 0 ) &&
                      <Typography component="p">
                          Nothing in playbackHistory.
                      </Typography>
                  }

                  <List>        
                      { playbackHistory !== null && playbackHistory.map((el,idx)=>{
                          return (
                              <div key={el.played_at+el.id}>
                                  <ListItem spacing={5} key={el.id} >
                                      <span><b>{String(idx+1) + ". "}&nbsp;</b></span>
                                      { !detectSmallScreen() &&
                                          <img src={el.thumbnail.url} className={classes.thumbnail}/>
                                      }
                                      &nbsp;
                                      <ListItemText primary={el.title}  /> 
                                      
                                      { !detectSmallScreen() &&
                                          <div> 
                                              { el.auto_queued && <MagicModeMarker video={el}/>} 
                                          </div>
                                      }
                                      <IconButton aria-label="more"
                                        aria-haspopup="true"
                                        aria-controls="simple-menu-{el.id}" 
                                        onClick={menuOpen}
                                      >
                                        <MoreVertIcon />
                                      </IconButton>
                                      <Menu id="simple-menu-{el.id}" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={menuClose}>
                                        <MenuItem onClick={menuClose}>
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
                                  { idx !== playbackHistory.length-11 && <Divider /> }
                              </div>
                          )
                      }).slice(Math.max(0, playbackHistory.length-11), playbackHistory.length).reverse()}
                  </List>
              </div>
          </CardContent>
      </Card>
  )
}


export default History;
