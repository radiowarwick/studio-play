import React, { Component } from 'react';

import AudiowallItem from './audiowallItem';

import Grid from '@material-ui/core/Grid';

class AudiowallWall extends Component {
    render() {
        const { items } = this.props.wall;
        let itemArray = [];

        let seen = 0;
        for(let i = 0; i < 12; i++) {
            const item = items[seen];
            if(item && item.item === i) {
                seen++
                itemArray.push(<AudiowallItem item={item} key={i} />);
            }
            else {
                itemArray.push(<AudiowallItem item={null} key={i} />);
            }
        }

        return (
            <Grid container spacing={1}>{itemArray}</Grid>
        );
    }
}

export default AudiowallWall;