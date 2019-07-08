import React from 'react';

import Button from '@material-ui/core/Button';
import Stop from '@material-ui/icons/Stop';

export default function AudioStop({ onClick, disabled }) {
    return (
        <Button
            variant="contained"
            color="secondary" 
            onClick={onClick}
            disabled={disabled ? disabled : false}>
            <Stop />
        </Button>
    );
}