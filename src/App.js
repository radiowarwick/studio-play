import React, { Component } from 'react';
import axios from 'axios';

import AudioPlayer from './components/audioPlayer';
import Audiowall from './components/audiowall';

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/styles';

const StyledApp = withStyles({
    root: {
        background: '#2b2b2b',
        color: 'white',
        height: '100vh',
        borderRadius: 0,
    }
})(Grid);

// Given an array of configuration objects, and a parameter string as input
// Return the configration where it's parameter matches the search string
const findInConfigration = (array, parameter) => { 
    return array.find(element => {
        if(element.parameter === parameter) {
            return element;
        }
    });
};

class App extends Component  {
    constructor(props) {
        super(props);
        
        // Setup audio
        this.audioContext = new AudioContext();
        this.audioContext.destination.channelInterpretation = 'discrete';
        this.audioContext.destination.channelCount = this.audioContext.destination.maxChannelCount;

        // Create our merger node (with same channels as output)
        // Connect the merger to our destination (the real output)
        this.mergerNode = this.audioContext.createChannelMerger(this.audioContext.destination.channelCount);
        this.mergerNode.connect(this.audioContext.destination);

        this.state = {
            md5: 0,
            mainAudiowall: null,
            userAudiowall: null,
        };
    }
    
    componentDidMount() {
        const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET);
        ws.addEventListener('message', ({data}) => {
            const { channel, payload } = JSON.parse(data);
            
            console.log(payload);
            
            if(channel === 't_configuration') {
                const { parameter, val, location } = payload;
                if(location === process.env.REACT_APP_STUDIO_LOCATION) {
                    if(parameter === 'next_on_showplan') {
                        this.setState({
                            md5: val,
                        });
                    }
                    else if(parameter === 'station_aw_set') {
                        this.setState({
                            mainAudiowall: val,
                        });
                    }
                    else if(parameter === 'user_aw_set') {
                        this.setState({
                            userAudiowall: val
                        });
                    }
                }
            }
        });

        axios.get(`${process.env.REACT_APP_BASE_URL}/api/configuration?key=${process.env.REACT_APP_DIGIPLAY_API_KEY}&location=${process.env.REACT_APP_STUDIO_LOCATION}`).then(({data}) => {
            this.setState({
                mainAudiowall: findInConfigration(data, 'station_aw_set').val,
                userAudiowall: findInConfigration(data, 'user_aw_set').val,
            });
        });

        this.setState({ws});
    }

    render() {
        return (
            <StyledApp container>
                <Grid
                    container
                    xs={6}
                    direction="column"
                    justify="center"
                    alignItems="center"
                    height="100%"
                >

                    <AudioPlayer
                        nextMD5={this.state.md5}
                        audioContext={this.audioContext}
                        mergerNode={this.mergerNode}
                        leftChannel={0}
                        rightChannel={1}
                    />

                    <AudioPlayer
                        nextMD5={this.state.md5}
                        audioContext={this.audioContext}
                        mergerNode={this.mergerNode}
                        leftChannel={2}
                        rightChannel={3}
                    />

                    <AudioPlayer
                        nextMD5={this.state.md5}
                        audioContext={this.audioContext}
                        mergerNode={this.mergerNode}
                        leftChannel={4}
                        rightChannel={5}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Audiowall
                        id={this.state.mainAudiowall}
                        audioContext={this.audioContext}
                        mergerNode={this.mergerNode}
                        leftChannel={0}
                        rightChannel={1}
                        />
                    <Audiowall
                        id={this.state.userAudiowall}
                        audioContext={this.audioContext}
                        mergerNode={this.mergerNode}
                        leftChannel={0}
                        rightChannel={1}
                    />
                </Grid>
            </StyledApp>
        );
    };
}

export default App;
