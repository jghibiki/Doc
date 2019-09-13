import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';     


const styles = theme => ({
});


class RequestButton extends Component {
    
    constructor(props){
        super(props);
        this.props = props;

        this.song = props.song;

    }

    addFavorite(){
        var favs = JSON.parse(localStorage.getItem("favorites"));
        if(favs === null || favs.length === 0) return

        
        var updated = false;
        for(var i=0; i<favs.length; i++){
            if(favs[i].name === "My Favorites"){
                var valid = true;

                for(var j=0; j<favs[i].children.length; j++){
                    if(favs[i].children[j].id === this.song.id){
                        valid = false;
                        break;
                    }
                }

                if(valid){
                    favs[i].children.push(this.song);
                    updated = true;
                    break;
                }
            }
        }

        if(updated){
            localStorage.setItem("favorites", JSON.stringify(favs))
            window.dirty_favorites = true;
        }
        
    }

    render(){
        const { classes, theme } = this.props;
        return (
            <Link onClick={()=>this.addFavorite()}>
                Add Favorite 
            </Link>
        )
    }
}

RequestButton.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(RequestButton);
