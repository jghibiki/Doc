import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class AlertDialog extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            open: false,
        };

        var dummy = () => {}

        this.onOk = props.onOk || dummy;
        this.onCancel = props.onCancel || dummy;
    }


  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleOk = () => {
    this.setState({ open: false });
    this.onOk();
  };

  handleCancel = () => {
    this.setState({ open: false });
    this.onCancel();
  };


  render() {
      const { title, message, control } = this.props;
      return (
          <div>
              <div onClick={this.handleClickOpen}>
                {control} 
              </div>
              <Dialog
                  open={this.state.open}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
              >
                  <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                  <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        {message}
                      </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                      <Button onClick={this.handleCancel} color="primary">
                          Cancel 
                      </Button>
                      <Button onClick={this.handleOk} color="primary" autoFocus>
                          Ok
                      </Button>
                  </DialogActions>
              </Dialog>
          </div>
      );
  }
}

export default AlertDialog;
