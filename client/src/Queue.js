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
import { makeStyles } from '@material-ui/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';

import RequestButton from './RequestButton.js';
import FavoriteButton from './FavoriteButton.js';
import ws_client from './WebSocketClient.js';

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


function Queue(){
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [queue, setQueue] = React.useState([]);
  const [displayQueue, setDisplayQueue] = React.useState([]);
  const [showFullQueue, setShowFullQueue] = React.useState(false);
  const [menuVideo, setMenuVideo] = React.useState(null);
  const classes = useStyles();

  React.useEffect(()=>{

    ws_client.subscribe("get.queue", data=>{
      setQueue(data.payload)
    });
    
    ws_client.subscribe("add.queue", data=>{
        let _queue = queue.slice();
        _queue.push(data.details);
        setQueue(q=>{return [...q, data.details]})
    })

    ws_client.subscribe("remove.queue", ()=>{
        setQueue([])
    });
    
   ws_client.registerInitHook(()=>{
        ws_client.send({type:"command", key:"get.queue"});
    });

  }, [])

  React.useEffect(()=>{
    if (showFullQueue){
      setDisplayQueue(queue)
    }
    else{
      setDisplayQueue(queue.slice(0, 10))
    }
  }, [queue, showFullQueue])

  const detectSmallScreen = () => {
      var width = withWidth()
      return width === "sm" || width === "xs"
  }

  const htmlDecode = (input) => {
      var doc = new DOMParser().parseFromString(input, "text/html");
      return doc.documentElement.textContent;
  }

  const toggleFullQueue = () => {
    setShowFullQueue(!showFullQueue)
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
    <CardContent className={classes.content}  >
       <div className={classes.details}>
                <Typography variant="headline" component="h2">
                  Queue
                </Typography>
                { queue.length === 0 &&
                    <Typography component="p">
                        Nothing in queue.
                    </Typography>
                }

                <List style={{maxHeight:"800px", overflowY: "auto", width:"100%"}}>        
                    {displayQueue.map((el,idx)=>{
                        return (
                          <div>
                            <ListItem spacing={5} key={el.id} flex>
                                <span><b>{String(idx+1) + ". "}</b></span>
                                &nbsp;
                                { !detectSmallScreen() &&
                                    <img src={el.thumbnail.url} className={classes.thumbnail}/>
                                }
                                &nbsp;
                                <ListItemText primary={htmlDecode(el.title)} />
                              <IconButton aria-label="more"
                                aria-haspopup="true"
                                aria-controls="simple-menu-{el.id}" 
                                onClick={(e)=>{menuOpen(e, el)}}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </ListItem>
                            { idx !== displayQueue.length-1 && <Divider /> }
                          </div>
                        )
                    })}
                </List>
            { queue.length > 10 &&
              <div><br/><Button primary onClick={()=>toggleFullQueue()}>
                { !showFullQueue && <span>Show Full Queue ({queue.length-10} more)</span> }
                { showFullQueue && <span>Hide Full Queue </span> }
              </Button></div>
            }
            <Menu id="simple-menu-queue-options" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={menuClose}>
              <MenuItem onclick={menuClose}>
                { menuVideo !== null &&
                  <Link href={"https://youtube.com/watch?v="+menuVideo.id} target="_blank">
                    Open on Youtube
                  </Link>
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

export default Queue;
