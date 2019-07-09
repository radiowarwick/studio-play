import React, { Component } from 'react';

import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/styles';

const StyledSlider = withStyles({
    root: {
      color: '#d8b222',
      height: 50,
    },
    thumb: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: 0,
        marginLeft: -25,
        '&:focus,&:hover,&$active': {
            boxShadow: 'inherit',
        },
        '$disabled &': {
            width: 50,
            height: 50,
            marginTop: 0,
            marginLeft: -25,
            borderRadius: 25,
        },
    },
    active: {},
    disabled: {},
    track: {
        height: 50,
        borderRadius: 8,
    },
    rail: {
        height: 50,
        borderRadius: 8,
    },
})(Slider);

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
            // this.setState({
            //     time: this.props.time,
            // });
        }
    }

    handleChange(event, value) {
        this.props.onChange(value);
        this.setState({
            time: value,
        });
    }

    render() {
        const { status } = this.props;
        const { time } = this.state;
        
        // Only disable the slider if we are playing the song or have no song loaded
        const disabled = status === 'playing' || status === 'initialized';

        return (
            <StyledSlider min={0} max={this.props.audioLength} value={time} disabled={disabled} onChange={this.handleChange} />
        );

    }
}

export default AudioPlayerProgress;