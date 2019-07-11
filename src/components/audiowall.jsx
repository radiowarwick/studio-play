import React, { Component } from 'react';
import axios from 'axios';

import AudiowallWall from './audiowallWall';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class Audiowall extends Component {
    constructor(props) {
        super(props);

        this.nextWall = this.nextWall.bind(this);
        this.previousWall = this.previousWall.bind(this);

        this.state = {
            loaded: false,
        };
    }

    componentDidUpdate(prevProps) {
        if(this.props.id !== prevProps.id) {
            this.setState({
                loaded: false,
            });

            axios.get(`http://digiplay/api/audiowall?key=${process.env.REACT_APP_DIGIPLAY_API_KEY}&id=${this.props.id}`).then(({data}) => {
                console.log(data.name);
                this.setState({
                    walls: data.walls,
                    currentWall: 0,
                    loaded: true,
                });
            });
        }
    }

    previousWall() {
        if(this.state.currentWall > 0) {
            this.setState({
                currentWall: this.state.currentWall - 1,
            });
        }
    }

    nextWall() {
        if(this.state.currentWall < this.state.walls.length - 1) {
            this.setState({
                currentWall: this.state.currentWall + 1,
            });
        }
    }

    render() {
        if(this.props.id !== 0 && this.state.loaded) {
            const walls = this.state.walls.map((wall, index) => {
                const style = {
                    display: index === this.state.currentWall ? 'inherit' : 'none',
                };

                return (
                    <div style={style}>
                        <AudiowallWall
                            wall={wall}
                            key={index}
                            audioContext={this.props.audioContext}
                            mergerNode={this.props.mergerNode}
                            leftChannel={this.props.leftChannel}
                            rightChannel={this.props.rightChannel}
                        />
                    </div>
                );
            });

            return (
                <div>
                    <Typography variant="h5">
                        {this.state.walls[this.state.currentWall].name}
                    </Typography>
            
                    {walls}

                    <Button variant="contained" color="primary" onClick={this.previousWall} disabled={this.state.currentWall <= 0}>Prev</Button>
                    <Button variant="contained" color="primary" onClick={this.nextWall} disabled={this.state.currentWall + 1 === this.state.walls.length}>Next</Button>
                </div>
            );
        }
        else {
            return <h1>No audiowall loaded</h1>;
        }
    } 
}

export default Audiowall;