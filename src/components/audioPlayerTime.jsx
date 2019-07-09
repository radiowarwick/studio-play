import React, { Component } from 'react';

class AudioPlayerTime extends Component {
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
    
    render() {
        let time = 0;
        if(this.props.audioLength) {
            time = this.props.audioLength-this.props.time;
        }

        let negative = false;
        if(time < 0) {
            negative = true;
            time = -time;
        }

        return (
            <span>
                {negative ? '-' : ''}
                {this.formatTime(time)}
            </span>
        );
    }
}

export default AudioPlayerTime;