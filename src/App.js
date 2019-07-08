import React, { Component } from 'react';

import AudioPlayer from './components/audioPlayer';

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

class App extends Component  {
    constructor(props) {
        super(props);
        this.audio = new AudioContext();
        this.audio.destination.channelInterpretation = 'discrete';
        
        this.state = {
            md5: 0,
        };
    }
    
    componentDidMount() {
        const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET);
        ws.onmessage = ({data}) => {
            const { channel, payload } = JSON.parse(data);
            
            console.log(payload);
            
            if(channel === 't_configuration') {
                const { parameter:type, val, location } = payload;
                if(location === process.env.REACT_APP_STUDIO_LOCATION) {
                    if(type === 'next_on_showplan') {
                        this.setState({
                            md5: val,
                        });
                    }
                }
            }
        };

        this.setState(ws);
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
                    height="100%">
                    <AudioPlayer nextMD5={this.state.md5} audio={this.audio} leftChannel={0} rightChannel={1} />
                    <AudioPlayer nextMD5={this.state.md5} audio={this.audio} leftChannel={0} rightChannel={1} />
                    <AudioPlayer nextMD5={this.state.md5} audio={this.audio} leftChannel={0} rightChannel={1} />
                </Grid>
                <Grid item xs={6}>
                    {/* Two audio wall components to go here... */}
                </Grid>
            </StyledApp>
        );
    };
}

export default App;
