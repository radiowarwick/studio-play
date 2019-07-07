import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

class AudioLoad extends Component {
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
                onClick={this.handleClick}
                disabled={!this.props.enabled}>
                Load
            </Button>
        );
    }
}

export default AudioLoad;