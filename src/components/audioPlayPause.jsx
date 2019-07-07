import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

class AudioPlayPause extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onClick();
    }

    render() {
        return (
            <Button
                variant="contained"
                color="primary" 
                onClick={this.handleClick}>
                Play/Pause
            </Button>
        );
    }
}

export default AudioPlayPause;