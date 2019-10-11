import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row'
    },
    goLiveBorderDesign: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor:'#9b9b9b'
    },
    goLiveTextDesign: {
        color: '#9b9b9b',
        fontSize: 10,
        textAlign: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8
    },
    enableGoLive: {
        borderRadius: 5,
        backgroundColor:'green'
    }
})

class GoLive extends Component {

    render() {
        return (
            <TouchableOpacity style={[!this.props.disabled ? styles.enableGoLive : styles.goLiveBorderDesign]} onPress={() => this.props.seekToLive()}>
                <Text style={[styles.goLiveTextDesign, !this.props.disabled && {color: '#fff'}]}>Go Live</Text>
            </TouchableOpacity>
        )
    }
}

GoLive.propTypes = {
    theme: PropTypes.string.isRequired,
    seekToLive: PropTypes.func.isRequired,
}

export {GoLive}
