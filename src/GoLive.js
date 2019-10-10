import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'

const backgroundColor = 'transparent'

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
            <TouchableOpacity style={styles.container} onPress={() => this.props.seekToLive()}>
                <View style={{borderRadius: 5,borderWidth: 1, borderColor:this.props.theme, paddingLeft: 4}}>
                    <Text style={{color: 'white', display: 'flex', fontSize: 10, paddingRight: 5}}>Go Live</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

GoLive.propTypes = {
    theme: PropTypes.string.isRequired,
    seekToLive: PropTypes.func.isRequired,
}

export {GoLive}
