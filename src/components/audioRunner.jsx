import React, { Component } from 'react';

class AudioRunner extends Component {
    constructor(props) {
        super(props);
        
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
            this.load();
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

        // If we have an audio resource when we mount
        // Immediately load it 
        if(this.props.audioResource) {
            this.load();
        }
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

        this.audio.addEventListener('loadedmetadata', () => this.props.updateAudioLength(this.audio.duration*1000));
        this.audio.addEventListener('timeupdate', () => this.props.eventTimeUpdate(this.audio.currentTime*1000));

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
        // If play is clicked and we haven't loaded
        // Then load the song in
        if(!this.state.loaded) {
            this.load();
        }

        // If an override time is given (from seeking) then use that as play time
        if(this.props.time && this.audio.currentTime*1000 !== this.props.time) {
            this.audio.currentTime = this.props.time / 1000;
        }

        // Play the audio element
        this.audio.play();
    }

    // Stop the currently playing audio source
    // Return the playtime when the pause happened
    stop() {
        if(this.state.loaded) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }

    pause() {
        if(this.state.loaded) {
            this.audio.pause();
        }
    }

    render() {
        return null;
    }
}

export default AudioRunner;