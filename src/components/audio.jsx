import { Component } from 'react';
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

        if(!this.state.loaded && this.props.audioResource/* && this.props.status !== 'initialized'*/) {
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
    
    load() {
        const { audio, audioResource } = this.props;

        // Fetch the data that we need
        axios.get(audioResource, {
            responseType: 'arraybuffer',
        }).then(response => {
            const { data } = response;

            console.time('decode');

            // Decode our audio file
            audio.decodeAudioData(data).then(decodedData => {
                console.timeEnd('decode');
                
                // Set it in the buffer to be used in the source node
                this.audioBuffer = decodedData;

                // Find length and pass up the data
                const length = Math.round((decodedData.length / decodedData.sampleRate) * 1000);
                this.props.updateAudioLength(length);
    
                // Set time to 0 and say we've loaded
                this.setState({
                    loaded: true,
                    time: 0,
                });
    
                // Pass up loaded message
                this.props.eventLoaded();
            });
        });
    }
    
    play() {
        console.log(`Playing from ${this.state.time}ms`);

        let { audio } = this.props;

        // Only play if loaded
        if(this.state.loaded) {
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