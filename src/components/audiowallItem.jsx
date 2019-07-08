import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/styles';

const StyledPaper = withStyles({
    root: {
        borderRadius: 5,
        height: 100,
        color: 'white',
        background: '#428bca',
        width: '100%',
    },
})(Paper);

class AudiowallItem extends Component {
    render() {
        if(this.props.item) {
            const { item } = this.props;

            const style = {
                color: item.foreground_colour,
                background: item.background_colour,
            };

            return (
                <Grid item xs={4}>
                    <StyledPaper style={style}>
                        {item.text}
                    </StyledPaper>
                </Grid>
            );
        }
        else {
            return (
                <Grid item xs={4}>
                    <StyledPaper>
                    </StyledPaper>
                </Grid>
            );
        }
    }
}

export default AudiowallItem