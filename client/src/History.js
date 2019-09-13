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
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [history, setHistory] = React.useState([]);
    const [partialHistory, setPartialHistory] = React.useState([]);
    const [partialHistoryIdx, setPartialHistoryIdx] = React.useState(0);
    const [menuVideo, setMenuVideo] = React.useState(null);
    const classes = useStyles();
        

    React.useEffect(()=>{
      ws_client.subscribe("get.history", data=>{
          setHistory(data.payload);

          var part = data.payload.slice(Math.max(0, data.payload.length-11), data.payload.length).reverse()
          setPartialHistoryIdx(data.payload.length)
          setPartialHistory(part)
      });
      
      ws_client.subscribe("add.history", data=>{
          let _history = history.slice();
          _history.push(data.payload);
          setHistory(_history)         

          let part = partialHistory.slice();
          part.splice(0,0, data.payload);
          part.pop();
          setPartialHistoryIdx(partialHistoryIdx+1)
          setPartialHistory(part)
      })

      ws_client.subscribe("remove.history", ()=>{
        setHistory([])

        setPartialHistoryIdx(0)
        setPartialHistory([])
      });
      
     ws_client.registerInitHook(()=>{
          ws_client.send({type:"command", key:"get.history"});
      });
  }, [])


  const detectSmallScreen = () => {
      var width = withWidth()
      return width === "sm" || width === "xs"
  }

  const menuOpen = (event, vid) =>{
    setMenuVideo(vid)
    setAnchorEl(event.currentTarget); 
  }

  const menuClose = (event) =>{
    setAnchorEl(null);
    setMenuVideo(null)
  }

  return (
     <Card className={classes.card}>
          <CardContent className={classes.content}>
             <div className={classes.details}>
                  <Typography variant="headline" component="h2">
                      History
                  </Typography>
                  { (partialHistory === null || partialHistory.length === 0 ) &&
                      <Typography component="p">
                          Nothing in playback history.
                      </Typography>
                  }

                  <List>        
                      {partialHistory.map((el,idx)=>{
                          return (
                              <div key={el.played_at+el.id}>
                                  <ListItem spacing={5} key={el.id} >
                                      <span><b>{String(partialHistoryIdx+1-idx) + ". "}</b></span>
                                      { !detectSmallScreen() &&
                                          <span>{"| "}</span>
                                      }
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
                                        onClick={(e)=>{menuOpen(e, el)}}
                                      >
                                        <MoreVertIcon />
                                      </IconButton>
                                  </ListItem>
                                  { idx !== partialHistory.length-11 && <Divider /> }
                              </div>
                          )
                      })}
                  </List>
                  <Menu id="simple-menu-history-options" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={menuClose}>
                    <MenuItem onclick={menuClose}>
                      { menuVideo !== null &&
                        <Link href={"https://youtube.com/watch?v="+menuVideo.id} target="_blank">
                          Open on Youtube
                        </Link>
                      }
                    </MenuItem>
                    <MenuItem>
                      { menuVideo !== null &&
                        <RequestButton song={menuVideo}/>
                      }
                    </MenuItem>
                    <MenuItem>
                      { menuVideo !== null &&
                        <FavoriteButton song={menuVideo}/>
                      }
                    </MenuItem>
                  </Menu>
              </div>
          </CardContent>
      </Card>
  )
}


export default History;
