import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
    
export default function AudioLoad({ onClick, disabled }) {
    return (
        <Button
            variant="contained"
            color="primary"
            onClick={onClick}
            disabled={disabled}>
            Load
        </Button>
    );
}