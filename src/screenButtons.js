import React from 'react'
import PropTypes from 'prop-types'
import {View, StyleSheet, TouchableOpacity} from 'react-native'

const styles = StyleSheet.create({
    btnContainer: {
        color: 'red',
        zIndex: 1000,
        position: 'absolute',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        height: '80%',
        alignContent: 'stretch'
    },
    individualButton: {display: 'flex', flexGrow: 1},
})

const ScreenButtons = (props) => (<View style={styles.btnContainer}>
    <View style={styles.individualButton}>
    </View>
    <TouchableOpacity style={styles.individualButton} onPress={props.onPress()}>

    </TouchableOpacity>
    <View style={styles.individualButton}>
    </View>

</View>)

ScreenButtons.propTypes = {
    onPress: PropTypes.func
}

ScreenButtons.defaultProps = {
    onPress: undefined
}

export {ScreenButtons}