import React from 'react';

import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

const MagicModeMarker = () => {
    return <Chip avatar={<Avatar><AllInclusiveIcon/></Avatar>} label="Magic Mode" />
}

export default MagicModeMarker
