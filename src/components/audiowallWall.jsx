import React, { Component } from 'react';

import AudiowallItem from './audiowallItem';

import Grid from '@material-ui/core/Grid';

class AudiowallWall extends Component {
    render() {
        const { items } = this.props.wall;
        
        // Item array to store our audiowall items for rendering
        let itemArray = [];
        // Seen keeps track of our current index (in items)
        let seen = 0;
        // array runs through all 12 items of a wall
        // This ensures that when there is a gap between items
        // it is appropriately filled with an empty item element
        for(let i = 0; i < 12; i++) {
            // Load an item, this may be null if seen is out of range
            const item = items[seen];

            // If item is not null, and the items location matches our i, add it to render it
            if(item && item.item === i) {
                seen++;
                itemArray.push(
                    <AudiowallItem
                        audioContext={this.props.audioContext}
                        mergerNode={this.props.mergerNode}
                        leftChannel={this.props.leftChannel}
                        rightChannel={this.props.rightChannel}
                        item={item}
                        key={i}
                    />
                );
            }
            // If our i doesn't match our current seen index, add a null item
            else {
                itemArray.push(<AudiowallItem item={null} key={i} />);
            }
        }

        // Return a grid container of our items 
        return (
            <Grid container spacing={1}>{itemArray}</Grid>
        );
    }
}

export default AudiowallWall;