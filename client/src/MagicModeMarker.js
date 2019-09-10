import React from 'react';

import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

import MagicModeMarkerDialog from './MagicModeMarkerDialog.js'

const MagicModeMarker = (props) => {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [video, setVideo] = React.useState(props.video);

    const handleOpen = () => {
        setDialogOpen(true)
    }

    const handleClose = () => {
        setDialogOpen(false)
    }


    return (
        <div>
            <Chip avatar={<Avatar><AllInclusiveIcon/></Avatar>} onClick={handleOpen} label="Magic Mode" />
            <MagicModeMarkerDialog open={dialogOpen} onClose={handleClose} video={video}/>
        </div>
    )
}

export default MagicModeMarker
