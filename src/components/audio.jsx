import React, { Component } from 'react';
import axios from 'axios';

class Audio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
        };
    }

    componentDidUpdate(prevProps) {
        console.log(this.props.status);
        if(prevProps.status === 'stopped' && this.props.status === 'playing') {
            this.play();
        }
        else if(prevProps.status === 'paused' && this.props.status === 'playing') {
            this.play(this.props.startTime);
        }
        else if(this.props.status === 'stopped') {
            this.stop();
        }
        else if(prevProps.status === 'playing' && this.props.status === 'paused') {
            const pauseTime = this.stop();
            this.props.eventPaused(pauseTime);
        }

        if(prevProps.audioID !== this.props.audioID) {
            this.setState({
                loaded: false,
            });
            this.load();
        }
    }

    componentDidMount() {
        let {audio} = this.props;

        // Create all the nodes that we need
        this.mergerNode = audio.createChannelMerger(audio.destination.channelCount);
        this.splitterNode = audio.createChannelSplitter(2);
        this.silent = audio.createBufferSource();
        this.src = audio.createBufferSource();

        this.src.connect(this.splitterNode);

        this.splitterNode.connect(this.mergerNode, 0, this.props.leftChannel);
        this.splitterNode.connect(this.mergerNode, 1, this.props.rightChannel);
        
        for(let i = 0; i < audio.destination.channelCount; i++) {
            if(i !== this.props.leftChannel && i !== this.props.rightChannel) {
                this.silent.connect(this.mergerNode, 0, i);
            }
        }

        this.mergerNode.connect(audio.destination);
        
        if(!this.state.loaded) {
            this.load();
        }
    }

    async load() {
        let response = await axios.get(`https://digiplay.radio.warwick.ac.uk/api/audio/download?key=${process.env.REACT_APP_DIGIPLAY_API_KEY}&id=${this.props.audioID}`, {
            responseType: 'arraybuffer',
        });
        this.audioBuffer = await this.props.audio.decodeAudioData(response.data);
        this.src.buffer = this.audioBuffer;
        
        const length = Math.round((this.audioBuffer.length / this.audioBuffer.sampleRate) * 1000);
        this.props.updateAudioLength(length);
        
        this.setState({
            loaded: true,
        });
        
        this.props.eventLoaded();
    }
    
    async play(time=0) {
        console.log(`Playing from ${time}ms`);

        let {audio} = this.props;

        // Load the audio if none is currently loaded
        if(!this.state.loaded) {
            await this.load();
        }
        
        // A source is one-use only
        // So we need to make a new one for each play
        this.src = audio.createBufferSource();
        this.src.buffer = this.audioBuffer;
        // Connect it to the splitter node, this then connects through to output
        this.src.connect(this.splitterNode);
        // Add event listener for ended
        // this.src.onended = this.props.eventEnded;
        // Converts time to seconds, play with that offset
        this.src.start(0, time/1000);

        // Sets a 'relative' start timestamp
        const startTimestamp = new Date().getTime() - time;
        this.props.eventPlaying(startTimestamp);
    }

    // Stop the currently playing audio source
    // Return the playtime when the pause happened
    stop() {
        try {
            this.src.stop(0);

            return new Date().getTime() - this.props.startTimestamp;
        } catch(e) {
            return null;
        }
    }

    render() {
        return <h1>{this.props.audioID}</h1>;
    }
}

export default Audio;