import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row'
    }
})

class GoLive extends Component {


    render() {
        return (
            <TouchableOpacity style={{borderRadius: 5,borderWidth: 1, borderColor:'#fff'}} onPress={() => this.props.seekToLive()}>
                <Text style={{color: 'white', fontSize: 10, textAlign: 'center', paddingVertical: 4, paddingHorizontal: 8}}>Go Live</Text>
            </TouchableOpacity>
        )
    }
}

GoLive.propTypes = {
    theme: PropTypes.string.isRequired,
    seekToLive: PropTypes.func.isRequired,
}

export {GoLive}
