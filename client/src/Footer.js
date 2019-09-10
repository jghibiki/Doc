import React from 'react';

// Material referances
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = {
  root: {
    flexGrow: 1,
  },
};

function Footer(props){
  const { classes } = props;
  return (
    <div className={classes.root} style={{"textAlign":"center"}}>
     <div>Doc: v2.0 Copyright 2019 Jordan Goetze</div>

    </div>
  )

}

export default withStyles(styles)(Footer);
