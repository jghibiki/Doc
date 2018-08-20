import React from 'react';

// Material referances
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    flexGrow: 1,
  },
};

function Footer(props){
  const { classes } = props;
  return (
    <div className={classes.root} style={{"textAlign":"center"}}>
     Doc: v2.0 Copyright 2018 Jordan Goetze
    </div>
  )

}

export default withStyles(styles)(Footer);
