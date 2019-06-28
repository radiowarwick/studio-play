import React, { Component } from 'react';

class AudioStop extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onClick();
    }

    render() {
        return (
            <button onClick={this.handleClick}>Stop</button>
        );
    }
}

export default AudioStop;