import React from 'react';

// Material referances
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

const styles = {
  root: {
    flexGrow: 1,
  },
};

function Footer(props){
  const { classes } = props;
  return (
    <div className={classes.root} style={{"textAlign":"center"}}>
    <Link 
      component="button"
      href="https://github.com/jghibiki/Doc/issues"
    >
      Feature Request / Report a Bug
    </Link>
    <br />
    <br />
     <div>Doc: v2.0 Copyright 2019 Jordan Goetze</div>

    </div>
  )

}

export default withStyles(styles)(Footer);
