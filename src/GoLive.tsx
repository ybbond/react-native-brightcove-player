import * as React from 'react'
import { Component } from 'react'
import { Text, StyleSheet, TouchableOpacity} from 'react-native'


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
interface GoLiveProps {
    disabled: boolean | undefined
    seekToLive: () => void
}

class GoLive extends Component <GoLiveProps, {}>{

    render() {
        return (
            <TouchableOpacity style={[!this.props.disabled ? styles.enableGoLive : styles.goLiveBorderDesign]} onPress={() => this.props.seekToLive()}>
                <Text style={[styles.goLiveTextDesign, !this.props.disabled && {color: '#fff'}]}>Go Live</Text>
            </TouchableOpacity>
        )
    }
}

export {GoLive}
