import React, { Component } from 'react';
import axios from 'axios';

class AudioRunner extends Component {
    constructor(props) {
        super(props);
        
        this.tick = this.tick.bind(this);
        this.load = this.load.bind(this);
        this.play = this.play.bind(this);

        this.state = {
            loaded: false,
        };

    }

    async componentDidUpdate(prevProps) {
        if((prevProps.status === 'stopped' || prevProps.status === 'paused') && this.props.status === 'playing') {
            this.play();
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
            // this.load();
        }
    }

    componentDidMount() {
        const { audioContext } = this.props;
        
        // Create all the nodes that we need
        this.mergerNode = audioContext.createChannelMerger(audioContext.destination.channelCount);
        this.splitterNode = audioContext.createChannelSplitter(2);
        this.silent = audioContext.createBufferSource();
        
        // Split our source to our speicified left and right channel
        this.splitterNode.connect(this.mergerNode, 0, this.props.leftChannel);
        this.splitterNode.connect(this.mergerNode, 1, this.props.rightChannel);
        
        // Connect silence to all other channels
        for(let i = 0; i < audioContext.destination.channelCount; i++) {
            if(i !== this.props.leftChannel && i !== this.props.rightChannel) {
                this.silent.connect(this.mergerNode, 0, i);
            }
        }
        
        // Connect to our destination
        this.mergerNode.connect(audioContext.destination);

        // Start our tick
        // const tickID = setInterval(this.tick, 10);
        // this.setState({tickID});
    }

    componentWillUnmount() {
        // Stop the tick
        clearInterval(this.state.tickID);
    }
    
    load() {
        const { audioContext, audioResource } = this.props;

        // Create new audio element
        this.audio = new Audio(audioResource);        
        this.audio.crossOrigin = 'anonymous';
        this.audio.preload = 'metadata';

        this.audio.onloadedmetadata = () => {
            this.props.updateAudioLength(this.audio.duration*1000);
        }
        
        // Create WebAudio source and connect it into our system
        this.src = audioContext.createMediaElementSource(this.audio);
        this.src.connect(this.splitterNode);
        
        this.setState({
            loaded: true,
            time: 0,
        });
        
        this.props.eventLoaded();
    }
    
    play() {
        console.log(`Playing now`);
        if(!this.state.loaded) {
            this.load();
        }

        this.audio.play();
    }

    // Stop the currently playing audio source
    // Return the playtime when the pause happened
    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    pause() {
        this.audio.pause();
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

export default AudioRunner;