import React, { Component } from 'react';

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
            <button onClick={this.handleClick}>Play/Pause</button>
        );
    }
}

export default AudioPlayPause;