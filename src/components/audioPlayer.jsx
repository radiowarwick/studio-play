import React, { Component } from 'react';
import axios from 'axios';

import AudioRunner from './audioRunner';
import AudioPlayPause from './audioPlayPause';
import AudioStop from './audioStop';
import AudioPlayerTime from './audioPlayerTime';
import AudioLoad from './audioLoad';
import AudioPlayerProgress from './audioPlayerProgress';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';

const StyledPlayer = withStyles({
    root: {
        background: '#454444',
        padding: '2em',
        margin: '0.5em',
        height: 'calc(100%/3 - 1em)',
    }
})(Grid);

class AudioPlayer extends Component {
    constructor(props) {
        super(props);

        this.eventPlayPauseClick = this.eventPlayPauseClick.bind(this);
        this.eventStopClick = this.eventStopClick.bind(this);
        this.updateAudioLength = this.updateAudioLength.bind(this);
        this.eventAudioLoaded = this.eventAudioLoaded.bind(this);
        this.eventAudioEnded = this.eventAudioEnded.bind(this);
        this.eventLoadClick = this.eventLoadClick.bind(this);
        this.eventAudioTimeUpdate = this.eventAudioTimeUpdate.bind(this);
        this.eventAudioTimeChange = this.eventAudioTimeChange.bind(this);

        this.state = {
            status: 'initialized',
            audioResource: null,
            md5: null,
            time: 0,
        };
    }

    eventPlayPauseClick() {
        let { status } = this.state;

        if(status === 'stopped' || status  === 'paused') {
            status = 'playing';
        }
        else if(status === 'playing') {
            status = 'paused';
        }

        this.setState({status});
    }

    eventStopClick() {
        if(this.state.status !== 'loading') {
            this.setState({
                time: 0,
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
            time: 0,
        });
    }

    eventLoadClick() {
        this.fetchData(this.props.nextMD5).then((data) => {
            this.setState({
                md5: this.props.nextMD5,
                audio: data,
                status: 'initialized',
            });
            console.log(data);
        });
    }

    eventAudioTimeChange(time) {
        this.setState({time});
    }

    eventAudioTimeUpdate(time) {
        this.setState({time});
    }

    async fetchData(md5) {
        let response = await axios.get(`http://digiplay/api/audio/info?key=${process.env.REACT_APP_DIGIPLAY_API_KEY}&md5=${md5}`);
        return response.data;
    }

    render() {
        const canLoad = this.state.status !== 'playing' && this.props.nextMD5 !== this.state.md5 && this.props.nextMD5;

        return (
            <StyledPlayer container spacing={1}>
                <AudioRunner
                    audioContext={this.props.audioContext}
                    mergerNode={this.props.mergerNode}
                    status={this.state.status}
                    audioResource={this.state.audio ? this.state.audio.resource : null}
                    leftChannel={this.props.leftChannel}
                    rightChannel={this.props.rightChannel}
                    eventLoaded={this.eventAudioLoaded}
                    eventEnded={this.eventAudioEnded}
                    eventTimeUpdate={this.eventAudioTimeUpdate}
                    updateAudioLength={this.updateAudioLength}
                    time={this.state.time}
                />
                
                <Grid item xs={5}>
                    <Typography variant="h2">
                        <AudioPlayerTime 
                            status={this.state.status}
                            time={this.state.time}
                            audioLength={this.state.audioLength} />
                    </Typography>
                </Grid>

                <Grid item xs={7}>
                    <Grid item xs>
                        <Typography variant="h5" noWrap>
                            Title: {this.state.audio ? this.state.audio.title : ''}
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h5" noWrap>
                            Artist: {this.state.audio ? this.state.audio.artist : ''}
                        </Typography>
                    </Grid>
                </Grid>
                
                <Grid item xs={12}>
                    <AudioPlayerProgress audioLength={this.state.audioLength} time={this.state.time} status={this.state.status} onChange={this.eventAudioTimeChange} />
                </Grid>
                
                <Grid item xs={4}>
                    <AudioPlayPause onClick={this.eventPlayPauseClick} status={this.state.status} />
                </Grid>

                <Grid item xs={4}>
                    <AudioStop onClick={this.eventStopClick} disabled={this.state.status === 'initialized'} />
                </Grid>

                <Grid item xs={4}>
                    <AudioLoad disabled={!canLoad} onClick={this.eventLoadClick} />
                </Grid>
            </StyledPlayer>
        );
    }
}

export default AudioPlayer;