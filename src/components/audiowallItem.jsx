import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import Audio from './audio';
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

        this.state = {
            status: 'initialized',
            time: 0,
            length: 0,
        };
    }

    eventAudioLoaded() {
        this.setState({
            status: 'stopped',
        });
    }

    eventAudioTick(time) {
        this.setState({time});
    }

    updateAudioLength(length) {
        this.setState({length});
    }

    render() {
        const { item } = this.props;
        
        let style;
        if(item && this.state.status !== 'initialized') {
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

            

            const audioResource = null;
            // const audioResource = `http://digiplay/api/audio/download?id=${item.audio_id}&key=${process.env.REACT_APP_DIGIPLAY_API_KEY}`;

            return (
                <Grid item xs={4}>
                    <StyledPaper style={style}>
                        <Audio
                            audio={this.props.audio}
                            leftChannel={this.props.leftChannel}
                            rightChannel={this.props.rightChannel}
                            audioResource={audioResource}
                            eventLoaded={this.eventAudioLoaded}
                            eventEnded={this.eventAudioEnded}
                            eventTick={this.eventAudioTick}
                            updateAudioLength={this.updateAudioLength}
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