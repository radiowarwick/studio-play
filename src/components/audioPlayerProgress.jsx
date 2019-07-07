import React, { Component } from 'react';
import Slider from '@material-ui/core/Slider';

class AudioPlayerProgress extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            time: 0,
        };
    }

    componentDidUpdate(prevProps) {
        if(this.props.time !== prevProps.time) {
            this.setState({
                time: this.props.time,
            });
        }
    }

    handleChange(event, value) {
        this.props.onChange(value);
        this.setState({
            time: value,
        });
    }

    render() {
        const { time } = this.state;
        const disabled = this.props.status === 'playing' || this.props.status === 'initialized';

        return <Slider min={0} max={this.props.audioLength} value={time} disabled={disabled} onChange={this.handleChange} />;

    }
}

export default AudioPlayerProgress;