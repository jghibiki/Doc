import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography'; import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import ws_client from './WebSocketClient.js';

const styles = theme => ({
  card: {
    alignItems: 'center',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
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
    center:{
        alignText: 'center',
        alignItems: 'center',
        alignContent: 'center',
        display: 'flex',
    }
});


class Volume extends Component {
    
    constructor(props){
        super(props);
        this.props = props;

        this.state = {
            volume: 0,
        }

        ws_client.subscribe("get.volume", results=>{
            this.setState({
                volume: results.payload.volume
            });
        });

        ws_client.subscribe("set.volume", resp=>{
            this.setState({ volume: resp.details.volume });
        });

       ws_client.registerInitHook(()=>{
            ws_client.send({type:"command", key:"get.volume"});
        });
    }


    sendSetVolume = (value) => (event) => {
        let vol;
        if(Number.isInteger(value)){
            vol = this.state.volume + value;
        }
        else {
            vol = Math.floor(value * 100);
        }

        let clamped_vol
        if(vol > 100){
            clamped_vol = 100
        }
        else if(vol < 0){
            clamped_vol = 0
        }
        else {
            clamped_vol = vol
        }

        ws_client.send({
            type: "command",
            key: "set.volume",
            details: {
                volume: clamped_vol 
            }
        }, true);
    }

    render(){
        const { classes, theme } = this.props;
        return (
           <Card className={classes.card}>
               <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography variant="headline" component="h2" style={{"text-align": "center"}}>
                          Volume
                        </Typography>
                        <Typography variant="headline" component="h2" style={{"text-align": "center"}}>
                            {this.state.volume}%
                        </Typography>
                        <Grid container spacing={16}>
                            <Grid item sm={6} >
                                <Button variant="contained" color="primary" fullWidth className={classes.button}  onClick={this.sendSetVolume(-1)}>-1</Button>
                            </Grid>
                            <Grid item sm={6} >
                                <Button variant="contained" color="primary" fullWidth className={classes.button}  onClick={this.sendSetVolume(+1)}>+1</Button>
                            </Grid>
                        </Grid>
                        <Grid container spacing={16}>
                            <Grid item sm={6} >
                                <Button variant="contained" color="primary" fullWidth className={classes.button}  onClick={this.sendSetVolume(-5)}>-5</Button>
                            </Grid>
                            <Grid item sm={6} >
                                <Button variant="contained" color="primary" fullWidth className={classes.button}  onClick={this.sendSetVolume(+5)}>+5</Button>
                            </Grid>
                        </Grid>
                        <Grid container spacing={16} >
                            <Grid item sm={3} >
                                <Button variant="contained" color="primary" fullWidth className={classes.button}  onClick={this.sendSetVolume(-0.1)}>0%</Button>
                            </Grid>
                            <Grid item sm={3} >
                                <Button variant="contained" color="primary" fullWidth className={classes.button}  onClick={this.sendSetVolume(0.5)}>50%</Button>
                            </Grid>
                            <Grid item sm={3} >
                                <Button variant="contained" color="primary" fullWidth className={classes.button}  onClick={this.sendSetVolume(0.8)}>80%</Button>
                            </Grid>
                            <Grid item sm={3} >
                                <Button variant="contained" color="primary" fullWidth className={classes.button}  onClick={this.sendSetVolume(1.1)}>100%</Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </div>
            </Card>
        )
    }
}

Volume.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(Volume);
