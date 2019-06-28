import React, { Component } from 'react';
import './App.css';
import AudioPlayer from './components/audioPlayer';

class App extends Component  {
    constructor(props) {
        super(props);
        this.audio = new AudioContext();
        this.audio.destination.channelInterpretation = 'discrete';
    }

    render() {
        return (
            <div>
                <AudioPlayer audio={this.audio} leftChannel={0} rightChannel={1} />
            </div>
        );
    };
}

export default App;
