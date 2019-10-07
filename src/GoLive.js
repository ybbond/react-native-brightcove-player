import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'

const backgroundColor = 'transparent'

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor,
        justifyContent: 'center',
        padding: 10,
        minWidth: 60
    }
})

class GoLive extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text style={{ color: this.props.theme }}>Go Live</Text>
            </View>
        )
    }
}

GoLive.propTypes = {

}

export { GoLive }
