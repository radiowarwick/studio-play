import React, { Component } from 'react';
import './App.css';

import AudioPlayer from './components/audioPlayer';

import Grid from '@material-ui/core/Grid';

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
            
            if(channel == 't_configuration') {
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
            <div>
                <Grid container>
                    <Grid item xs={6}>
                        <AudioPlayer nextMD5={this.state.md5} audio={this.audio} leftChannel={0} rightChannel={1} />
                        <AudioPlayer nextMD5={this.state.md5} audio={this.audio} leftChannel={0} rightChannel={1} />
                        <AudioPlayer nextMD5={this.state.md5} audio={this.audio} leftChannel={0} rightChannel={1} />
                    </Grid>
                </Grid>
            </div>
        );
    };
}

export default App;
