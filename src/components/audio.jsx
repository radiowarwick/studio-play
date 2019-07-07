import React, { Component } from 'react';
import axios from 'axios';

class Audio extends Component {
    constructor(props) {
        super(props);
        
        this.tick = this.tick.bind(this);

        this.state = {
            loaded: false,
        };

    }

    async componentDidUpdate(prevProps) {
        if((prevProps.status === 'stopped' || prevProps.status === 'paused') && this.props.status === 'playing') {
            await this.play();
        }
        else if(prevProps.status !== 'stopped' && this.props.status === 'stopped') {
            this.stop();
        }
        else if(prevProps.status === 'playing' && this.props.status === 'paused') {
            this.pause();
        }

        // If our audio resource changes, stop what we're playing and reload
        if(prevProps.audioResource !== this.props.audioResource) {
            this.stop();
            this.setState({
                loaded: false,
            });
            this.load();
        }
    }

    componentDidMount() {
        const { audio } = this.props;
        
        // Create all the nodes that we need
        this.mergerNode = audio.createChannelMerger(audio.destination.channelCount);
        this.splitterNode = audio.createChannelSplitter(2);
        this.silent = audio.createBufferSource();
        this.src = audio.createBufferSource();
        
        // Connect our audio to be split into channels
        this.src.connect(this.splitterNode);
        
        // Split our source to our speicified left and right channel
        this.splitterNode.connect(this.mergerNode, 0, this.props.leftChannel);
        this.splitterNode.connect(this.mergerNode, 1, this.props.rightChannel);
        
        // Connect silence to all other channels
        for(let i = 0; i < audio.destination.channelCount; i++) {
            if(i !== this.props.leftChannel && i !== this.props.rightChannel) {
                this.silent.connect(this.mergerNode, 0, i);
            }
        }
        
        // Connect to our destination
        this.mergerNode.connect(audio.destination);

        if(!this.state.loaded && this.props.audioResource && this.props.status !== 'initialized') {
            this.load();
        }

        // Start our tick
        const tickID = setInterval(this.tick, 10);
        this.setState({tickID});
    }

    componentWillUnmount() {
        // Stop the tick
        clearInterval(this.state.tickID);
    }
    
    async load() {
        const { audio } = this.props;

        let response = await axios.get(this.props.audioResource, {
            responseType: 'arraybuffer',
        });
        this.audioBuffer = await audio.decodeAudioData(response.data);
        this.src.buffer = this.audioBuffer;
        
        const length = Math.round((this.audioBuffer.length / this.audioBuffer.sampleRate) * 1000);
        this.props.updateAudioLength(length);
        
        this.setState({
            loaded: true,
            time: 0,
        });

        this.props.eventLoaded();
    }
    
    async play() {
        console.log(`Playing from ${this.state.time}ms`);

        let { audio } = this.props;

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

        // If we have a prop time, use that as the overrided time 
        const playTime = this.props.time ? this.props.time : this.state.time;
        
        // Convert time to seconds and play with that offset
        this.src.start(0, playTime / 1000);

        // Sets a 'relative' start timestamp
        const startTimestamp = new Date().getTime() - playTime;
        this.setState({startTimestamp});
    }

    // Stop the currently playing audio source
    // Return the playtime when the pause happened
    stop() {
        try {
            this.src.stop(0);
        } catch(e) {
            return null;
        }
    }

    pause() {
        this.src.stop(0);
    }

    tick() {
        const { time:originalTime } = this.state;
        let { time } = this.state;

        if(this.props.status === 'playing') {
            // Whilst playing keep updating time
            time = new Date().getTime() - this.state.startTimestamp;
        }
        else if(this.props.status === 'stopped') {
            // We're stopped so set time to 0
            time = 0;
        }
        
        // We only update the state and notify the parent if play time changes
        if(originalTime !== time) {
            this.setState({time});
            this.props.eventTick(time);
        }
    }

    render() {
        return null;
    }
}

export default Audio;