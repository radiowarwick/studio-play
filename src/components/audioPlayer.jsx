import React, { Component } from 'react';
import Audio from './audio';
import AudioPlayPause from './audioPlayPause';
import AudioStop from './audioStop';
import AudioPlayerTime from './audioPlayerTime';

class AudioPlayer extends Component {
    constructor(props) {
        super(props);

        this.eventPlayPauseClick = this.eventPlayPauseClick.bind(this);
        this.eventStopClick = this.eventStopClick.bind(this);
        this.eventAudioPaused = this.eventAudioPaused.bind(this);
        this.eventAudioPlaying = this.eventAudioPlaying.bind(this);
        this.updateAudioLength = this.updateAudioLength.bind(this);
        this.eventAudioLoaded = this.eventAudioLoaded.bind(this);
        this.eventAudioEnded = this.eventAudioEnded.bind(this);

        this.state = {
            audioID: 41116,
            status: 'loading',
        };
    }

    eventPlayPauseClick() {
        if(this.state.status === 'stopped') {
            this.setState({
                startTime: 0,
                status: 'playing',
            });
        }
        else if(this.state.status === 'paused') {
            this.setState({
                status: 'playing',
            });
        }
        else if(this.state.status === 'playing') {
            this.setState({
                status: 'paused',
            });
        }
    }

    eventStopClick() {
        if(this.state.status !== 'loading') {
            this.setState({
                startTime: 0,
                status: 'stopped',
            });
        }
    }
    
    // When audio is paused, get the time played of the track
    eventAudioPaused(time) {
        this.setState({
            startTime: time,
        });
    }

    // When audio starts playing get the starting timestamp
    eventAudioPlaying(timestamp) {
        this.setState({
            startTimestamp: timestamp,
        });
    }

    updateAudioLength(length) {
        this.setState({
            audioLength: length,
        });
    }

    // When audio has loaded set the state to stopped
    eventAudioLoaded() {
        this.setState({
            startTime: 0,
            status: 'stopped',
        });
    }

    eventAudioEnded() {
        this.setState({
            startTime: 0,
            status: 'stopped',
        });
    }

    render() {
        return (
            <div>
                <Audio
                    audio={this.props.audio}
                    status={this.state.status}
                    audioID={this.state.audioID}
                    startTime={this.state.startTime}
                    startTimestamp={this.state.startTimestamp} 
                    leftChannel={this.props.leftChannel}
                    rightChannel={this.props.rightChannel}
                    eventPaused={this.eventAudioPaused}
                    eventPlaying={this.eventAudioPlaying}
                    eventLoaded={this.eventAudioLoaded}
                    eventEnded={this.eventAudioEnded}
                    updateAudioLength={this.updateAudioLength} />
                <AudioPlayPause 
                    onClick={this.eventPlayPauseClick} />
                <AudioStop 
                    onClick={this.eventStopClick} />
                <AudioPlayerTime 
                    status={this.state.status}
                    startTimestamp={this.state.startTimestamp} 
                    startTime={this.state.startTime}
                    audioLength={this.state.audioLength} />
            </div>
        );
    }
}

export default AudioPlayer;