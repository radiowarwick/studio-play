import React from 'react';

import Button from '@material-ui/core/Button';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';

export default function AudioPlayPause({ status, onClick }) {
    const icon = (status === 'playing') ? <Pause /> : <PlayArrow />;

    return (
        <Button
            variant="contained"
            color="primary" 
            onClick={onClick}>
            { icon }
        </Button>
    );
}