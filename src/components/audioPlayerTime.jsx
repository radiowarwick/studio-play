import React, { Component } from 'react';

class AudioPlayerTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeRemaining: 0,
        }
        this.tick = this.tick.bind(this);
    }
    
    componentDidMount() {
        this.tickID = setInterval(this.tick, 10);
    }

    componentWillUnmount() {
        clearInterval(this.tickID);
    }

    formatTime(time) {
        let milliseconds = Math.round((time % 1000) / 10);
        if(milliseconds < 10) {
            milliseconds = `0${milliseconds}`;
        }
        time = Math.floor(time / 1000);
        
        let seconds = time % 60;
        if(seconds < 10) {
            seconds = `0${seconds}`;
        }
        time = Math.floor(time / 60);

        let minutes = time;
        if(minutes < 10) {
            minutes = `0${minutes}`;
        }

        return `${minutes}:${seconds}.${milliseconds}`;
    }
    
    tick() {
        let time;
        // If playing then we update the time each tick, otherwise it's static
        if(this.props.status === 'playing') {
            time = this.props.audioLength - (new Date().getTime() - this.props.startTimestamp);
        }
        else if(this.props.status === 'stopped') {
            time = this.props.audioLength;
        }
        else if(this.props.status === 'paused') {
            time = this.props.audioLength - this.props.startTime;
        }
        else {
            time = 0;
        }

        // Make sure time doesn't go negative
        time = (time < 0) ? 0 : time;

        this.setState({
            timeRemaining: time,
        });
    }

    render() {
        return (
            <h1>{this.formatTime(this.state.timeRemaining)}</h1>
        );
    }
}

export default AudioPlayerTime;