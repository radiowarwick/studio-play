import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import AudioRunner from './audio';
import AudioPlayerTime from './audioPlayerTime';

const StyledPaper = withStyles({
    root: {
        borderRadius: 5,
        height: 100,
        color: 'white',
        background: '#428bca',
        width: '100%',
    },
})(Paper);

class AudiowallItem extends Component {
    constructor(props) {
        super(props);

        this.eventAudioLoaded = this.eventAudioLoaded.bind(this);
        this.eventAudioTick = this.eventAudioTick.bind(this);
        this.updateAudioLength = this.updateAudioLength.bind(this);
        this.eventPlayStop = this.eventPlayStop.bind(this);

        this.state = {
            status: 'stopped',
            time: 0,
            length: 0,
        };
    }

    eventAudioLoaded() {
        // this.setState({
        //     status: 'stopped',
        // });
    }

    eventAudioTick(time) {
        this.setState({time});
    }

    updateAudioLength(length) {
        this.setState({length});
    }

    eventPlayStop() {
        let { status } = this.state;

        if(status === 'playing') {
            status = 'stopped';
        }
        else if(status === 'stopped') {
            status = 'playing';
        }

        this.setState({status});
    }

    render() {
        const { item } = this.props;
        
        let style;
        if(item) {
            style = {
                color: item.foreground_colour,
                background: item.background_colour,
            };
        }
        else {
            style = {
                color: 'white',
                background: 'grey',
            };
        }
        
        if(item) {
            // const audioResource = null;
            // const audioResource = `http://digiplay/api/audio/download?id=${item.audio_id}&key=${process.env.REACT_APP_DIGIPLAY_API_KEY}`;
            const audioResource = `http://digiplay/api/audio/download?key=${process.env.REACT_APP_DIGIPLAY_API_KEY}&id=10832`;

            return (
                <Grid item xs={4}>
                    <StyledPaper
                        style={style}
                        onClick={this.eventPlayStop}
                    >
                        <AudioRunner
                            audioContext={this.props.audio}
                            leftChannel={this.props.leftChannel}
                            rightChannel={this.props.rightChannel}
                            audioResource={audioResource}
                            eventLoaded={this.eventAudioLoaded}
                            eventEnded={this.eventAudioEnded}
                            eventTick={this.eventAudioTick}
                            updateAudioLength={this.updateAudioLength}
                            status={this.state.status}
                        />

                        <Typography variant="h6" align="center" noWrap>
                            {item.text}
                        </Typography>

                        <AudioPlayerTime
                            audioLength={this.state.length}
                            time={this.state.time}
                        />
                    </StyledPaper>
                </Grid>
            );
        }
        else {
            return (
                <Grid item xs={4}>
                    <StyledPaper style={style}>
                    </StyledPaper>
                </Grid>
            );
        }
    }
}

export default AudiowallItem