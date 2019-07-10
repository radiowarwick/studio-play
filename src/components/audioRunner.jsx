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
        const { audioContext, mergerNode, audioResource } = this.props;
        let { leftChannel, rightChannel } = this.props;

        // If we are trying to use a channel which we don't have access to
        // Then we'll just set left and right channels to 0 and 1 respectively
        leftChannel = (leftChannel >= audioContext.destination.channelCount) ? 0 : leftChannel;
        rightChannel = (rightChannel >= audioContext.destination.channelCount) ? 1 : rightChannel;

        // Create the node to split our source into left and right
        this.splitterNode = audioContext.createChannelSplitter(2);
        
        // Take the left and right channel of the splitter
        // Then connect them to the appropraite inputs (left/right channels)
        // of the merger node
        this.splitterNode.connect(mergerNode, 0, leftChannel);
        this.splitterNode.connect(mergerNode, 1, rightChannel);
        
        // If we have an audio resource when we mount
        // Immediately load it 
        if(audioResource) {
            this.load();
        }
    }
    
    load() {
        const { audioContext, audioResource } = this.props;

        // Create new audio element
        this.audio = new Audio(audioResource);        
        this.audio.crossOrigin = 'anonymous';
        this.audio.preload = 'metadata';

        // Inform the parent of the length when we know it
        this.audio.addEventListener('loadedmetadata', () => this.props.updateAudioLength(this.audio.duration*1000));
        // Inform the parent of current time when it changes
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