import React from 'react';

import Button from '@material-ui/core/Button';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';

import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

export default function AudioPlayPause({ status, onClick }) {
    const icon = (status === 'playing') ? <Pause /> : <PlayArrow />;
    const disabled = status === 'initialized';

    let style = {}
    if(!disabled) {
        style = {
            background: (status === 'playing') ? amber[500] : green[700],
        };
    }

    return (
        <Button
            variant="contained"
            style={style}
            onClick={onClick}
            disabled={status === 'initialized'}
        >
            { icon }
        </Button>
    );
}