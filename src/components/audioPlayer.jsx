import React, { Component } from 'react';
import axios from 'axios';

import Audio from './audio';
import AudioPlayPause from './audioPlayPause';
import AudioStop from './audioStop';
import AudioPlayerTime from './audioPlayerTime';
import AudioLoad from './audioLoad';
import AudioPlayerProgress from './audioPlayerProgress';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

class AudioPlayer extends Component {
    constructor(props) {
        super(props);

        this.eventPlayPauseClick = this.eventPlayPauseClick.bind(this);
        this.eventStopClick = this.eventStopClick.bind(this);
        this.updateAudioLength = this.updateAudioLength.bind(this);
        this.eventAudioLoaded = this.eventAudioLoaded.bind(this);
        this.eventAudioEnded = this.eventAudioEnded.bind(this);
        this.eventLoadClick = this.eventLoadClick.bind(this);
        this.eventAudioTick = this.eventAudioTick.bind(this);
        this.eventAudioTimeChange = this.eventAudioTimeChange.bind(this);

        this.state = {
            status: 'initialized',
            audioResource: null,
            md5: null,
            time: 0,
        };
    }

    eventPlayPauseClick() {
        const { status } = this.state;
        let newStatus;

        if(status === 'stopped' || status  === 'paused') {
            newStatus = 'playing';
        }
        else if(status === 'playing') {
            newStatus = 'paused';
        }

        this.setState({
            status: newStatus,
            // overrideTime: null,
        });
    }

    eventStopClick() {
        if(this.state.status !== 'loading') {
            this.setState({
                startTime: 0,
                status: 'stopped',
            });
        }
    }

    updateAudioLength(length) {
        this.setState({
            audioLength: length,
        });
    }

    // When audio has loaded set the state to stopped
    eventAudioLoaded() {
        this.setState({
            status: 'stopped',
        });
    }

    eventAudioEnded() {
        this.setState({
            status: 'stopped',
        });
    }

    eventLoadClick() {
        this.fetchData(this.props.nextMD5).then((data) => {
            this.setState({
                md5: this.props.nextMD5,
                audio: data,
            });
            console.log(data);
        });
    }

    eventAudioTick(time) {
        this.setState({time});
    }

    eventAudioTimeChange(time) {
        this.setState({time});
    }

    async fetchData(md5) {
        let response = await axios.get(`http://digiplay/api/audio/info?key=${process.env.REACT_APP_DIGIPLAY_API_KEY}&md5=${md5}`);
        return response.data;
    }

    render() {
        const canLoad = this.state.status !== 'playing' && this.props.nextMD5 !== this.state.md5 && this.props.nextMD5;

        return (
            <Grid container spacing={3}>
                <Audio
                    audio={this.props.audio}
                    status={this.state.status}
                    audioResource={this.state.audio ? this.state.audio.resource : null}
                    leftChannel={this.props.leftChannel}
                    rightChannel={this.props.rightChannel}
                    eventLoaded={this.eventAudioLoaded}
                    eventEnded={this.eventAudioEnded}
                    eventTick={this.eventAudioTick}
                    updateAudioLength={this.updateAudioLength}
                    time={this.state.time}
                    />
                
                <Grid item xs={12}>
                    <Typography variant="h1">
                        <AudioPlayerTime 
                            status={this.state.status}
                            time={this.state.time}
                            audioLength={this.state.audioLength} />
                    </Typography>
                </Grid>
                
                <Grid item xs={6}>Title: {this.state.audio ? this.state.audio.title : ''}</Grid>
                <Grid item xs={6}>Artist: {this.state.audio ? this.state.audio.artist : ''}</Grid>
                
                <Grid item xs={4}>
                    <AudioPlayPause onClick={this.eventPlayPauseClick} />
                </Grid>

                <Grid item xs={4}>
                    <AudioStop onClick={this.eventStopClick} />
                </Grid>

                <Grid item xs={4}>
                    <AudioLoad enabled={canLoad} onClick={this.eventLoadClick} />
                </Grid>

                <Grid item xs={12}>
                    <AudioPlayerProgress audioLength={this.state.audioLength} time={this.state.time} status={this.state.status} onChange={this.eventAudioTimeChange} />
                </Grid>

            </Grid>
        );
    }
}

export default AudioPlayer;