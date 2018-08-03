import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PlaylistPlay from '@material-ui/icons/PlaylistPlay';
import AddCircle from '@material-ui/icons/AddCircle';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import Edit from '@material-ui/icons/Edit';
import Cancel from '@material-ui/icons/Cancel';

import Egg from './egg.js'

import RequestButton from './RequestButton.js';
import EditFavoriteDialog from './EditFavoriteDialog.js';
import AddFavoritesCollectionDialog from './AddFavoritesCollectionDialog.js';
import RemoveFavoritesCollectionDialog from './RemoveFavoritesCollectionDialog.js';
import AlertDialog from './AlertDialog.js';
import ws_client from './WebSocketClient.js';

const styles = theme => ({
  thumbnail: {
      width: "5%"
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
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
});


class Favorites extends Component {
    
    constructor(props){
        super(props);
        this.props = props;

        this.state = {
            favorites: [],
            playlistMode: false,

            showEditDialog: false,
            selectedFavorite: null,
            selectedParent: null,

            showAddCollectionDialog: false,
            showRemoveCollectionDialog: false,
        };


        this.loadFavorites(true);
        window.dirty_favorites = false;

        new Egg("m,u,s,i,c", ()=> {
            this.setState({
                playlistMode: !this.state.playlistMode
            })
        }).listen()

        setInterval(()=>this.watchDog(), 100);
    }

    watchDog(){
        if(window.dirty_favorites){
            console.log("dirty");
            let storage =  JSON.parse(localStorage.getItem("favorites"));
            this.setState({ favorites: []})
            this.setState({ favorites: storage })
            this.forceUpdate();
            window.dirty_favorites = false;
        }
    }

    loadFavorites = (init)=>{

        var favorites = localStorage.getItem("favorites")

        if(favorites === null){
            favorites = [
                { 
                    name: "My Favorites",
                    key: 0,
                    children: [],
                    open: true
                }
            ]
        }
        else{
            favorites = JSON.parse(favorites);
        }

        if(init){
            this.state = {
                "favorites": favorites
            };
        }
        else{
            this.setState = ({
                "favorites": favorites
            });
        }
        localStorage.setItem("dirty_favorites", "false")

        this.saveFavorites(favorites);
    }

    saveFavorites = (favorites)=>{
        if(favorites === undefined){
            localStorage.setItem("favorites", JSON.stringify(this.state.favorites));
        }
        else{
            localStorage.setItem("favorites", JSON.stringify(favorites));
        }
    }

    handleToggle(parent_name){
        for(var i=0; i<this.state.favorites.length; i++){
            if(this.state.favorites[i].name === parent_name){
                this.state.favorites[i].open = !this.state.favorites[i].open;
                this.setState(this.state.favorites);
                this.saveFavorites();
            }
        }
    }

    handleOpenEditFavorite = (selectedFavorite, selectedParent) => () => {
        this.setState({
            selectedFavorite: selectedFavorite,
            selectedParent: selectedParent,
            showEditDialog: true
        });
    }

    handleCloseEditFavorite = favorites => {
        this.setState({
            favorites: favorites,
            showEditDialog: false
        })
        this.saveFavorites(favorites);
    }

    handleOpenAddCollection = () => {
        this.setState({
            showAddCollectionDialog: true 
        })
    }

    handleCloseAddCollection = favorites => {
        this.setState({
            showAddCollectionDialog: false,
            favorites: favorites
        })
        this.saveFavorites(favorites);
    }

    handleOpenRemoveCollection = () => {
        this.setState({
            showRemoveCollectionDialog: true 
        })
    }

    handleCloseRemoveCollection = favorites => {
        this.setState({
            showRemoveCollectionDialog: false,
            favorites: favorites
        })
        this.saveFavorites(favorites);
    }

    handleDelete = (child, parent) => () => {
        var favs = this.state.favorites

        for(var i=0; i<parent.children.length; i++){
            if(parent.children[i].id === child.id){
                parent.children.splice(i, 1)
                break;
            }
        }

        this.setState({
            favorites: favs 
        })
        this.saveFavorites(favs);
    }

    handleQueuePlaylist = (collection_name) => () => {
        var collection = null;
        for(var i=0; i<this.state.favorites.length; i++){
            if(this.state.favorites[i].name === collection_name){
                collection = this.state.favorites[i];
                break;
            }
        }

        if(collection === null){
            return;
        }

        for(var i=0; i<collection.children.length; i++){
            ws_client.send({
                type: "command",
                key: "add.queue", 
                details: collection.children[i]
            }, true);
        }
    }

    render(){
        const { classes, theme } = this.props;

        return (
           <Card className={classes.card}>
                    <CardContent className={classes.content}>
                        <Typography variant="headline" component="h2">
                            Favorites
                        </Typography>

                        <List className={classes.flex} component="nav">        
                            {this.state.favorites.map((parent,idx)=>{
                                return (
                                    <div className={classes.flex}>
                                        <ListItem  spacing={5} key={parent.key} >
                                            <ListItemText primary={parent.name} />
                                            {this.state.playlistMode && 
                                                <Button onClick={this.handleQueuePlaylist(parent.name)}>
                                                    <PlaylistPlay />
                                                </Button>
                                            }
                                            <Button onClick={()=>this.handleToggle(parent.name)}>
                                                {parent.open ? <ExpandLess /> : <ExpandMore />}
                                            </Button>
                                        </ListItem>
                                        <Collapse in={parent.open} timeout="auto" unmountOnExit>
                                            <List>
                                                { parent.children.length === 0 &&
                                                    <ListItem>
                                                        <Typography component="p">
                                                            No saved favorites!
                                                        </Typography>
                                                    </ListItem>
                                                }
                                                {parent.children.map(child=>{
                                                    return (
                                                        <ListItem>
                                                            <img src={child.thumbnail.url} className={classes.thumbnail}/>
                                                            <span>{"| "}</span>
                                                            <ListItemText primary={child.title} />
                                                            <RequestButton song={child} />
                                                            <Button onClick={this.handleOpenEditFavorite(child, parent)}>
                                                                <Edit />
                                                            </Button>
                                                            <AlertDialog 
                                                                title="Confirm Delete"
                                                                message="Are you sure you wish to delete this from your favorites?"
                                                                onOk={this.handleDelete(child, parent)}
                                                                control={
                                                                    <Button>
                                                                        <Cancel />
                                                                    </Button>
                                                                }
                                                            />
                                                        </ListItem>
                                                    )
                                                })}
                                            </List>
                                        </Collapse>
                                    </div>
                                )
                            })}
                        </List>
                        <EditFavoriteDialog 
                            favorites={this.state.favorites}    
                            favorite={this.state.selectedFavorite}  
                            parent={this.state.selectedParent}
                            open={this.state.showEditDialog} 
                            onClose={this.handleCloseEditFavorite}
                        />
                        <AddFavoritesCollectionDialog favorites={this.state.favorites} 
                            open={this.state.showAddCollectionDialog}
                            onClose={this.handleCloseAddCollection}/>
                        <RemoveFavoritesCollectionDialog favorites={this.state.favorites} 
                            open={this.state.showRemoveCollectionDialog}
                            onClose={this.handleCloseRemoveCollection}/>
                        <CardActions>
                            <Button onClick={this.handleOpenAddCollection}>
                                <AddCircle className={classNames(classes.leftIcon, classes.iconSmall)}/>
                                Add Collection
                            </Button>
                            <Button onClick={this.handleOpenRemoveCollection}>
                                <RemoveCircle className={classNames(classes.leftIcon, classes.iconSmall)}/>
                                Remove Collection
                            </Button>
                        </CardActions>

                    </CardContent>
            </Card>
        )
    }
}

Favorites.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(Favorites);
