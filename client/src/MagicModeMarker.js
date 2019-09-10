import React from 'react';

import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

const MagicModeMarker = (props) => {
    return <Chip avatar={<Avatar><AllInclusiveIcon/></Avatar>} onClick={ ()=>{alert(props.video.title);}} label="Magic Mode" />
}

export default MagicModeMarker
