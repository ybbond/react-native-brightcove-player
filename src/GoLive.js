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
        borderColor:'#fff'
    },
    goLiveTextDesign: {
        color: 'white',
        fontSize: 10,
        textAlign: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8
    }
})

class GoLive extends Component {


    render() {
        return (
            <TouchableOpacity style={styles.goLiveBorderDesign} onPress={() => this.props.seekToLive()}>
                <Text style={styles.goLiveTextDesign}>Go Live</Text>
            </TouchableOpacity>
        )
    }
}

GoLive.propTypes = {
    theme: PropTypes.string.isRequired,
    seekToLive: PropTypes.func.isRequired,
}

export {GoLive}
