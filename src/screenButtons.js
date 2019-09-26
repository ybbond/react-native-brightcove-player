import React from 'react'
import PropTypes from 'prop-types'
import {View, StyleSheet, TouchableOpacity, Text, ActivityIndicator} from 'react-native'
import Icons from "react-native-vector-icons/MaterialIcons";

const styles = StyleSheet.create({
    btnContainer: {
        color: 'red',
        zIndex: 1000,
        position: 'absolute',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        alignContent: 'stretch'
    },
    individualButton: {display: 'flex', flexGrow: 1},
    centerButton: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}
})

const ScreenButtons = (props) => (<View style={styles.btnContainer}>
    <TouchableOpacity style={[styles.individualButton, styles.centerButton]} onPress = {props.rewind()}>
        {props.showControls && <Icons
            name={'fast-rewind'}
            color={'#ff5000'}
            size={40}
        />}
    </TouchableOpacity>
    <TouchableOpacity style={[styles.individualButton, styles.centerButton]} onPress = {props.togglePlay()}>
        {props.loading && <ActivityIndicator size="large" color="#ff5000"/>}
        {props.showControls && !props.loading && <Icons
            name={!props.paused ? 'play-arrow' : 'pause'}
            color={'#ff5000'}
            size={40}
        />}
    </TouchableOpacity>
    <TouchableOpacity style={[styles.individualButton, styles.centerButton]} onPress = {props.forward()}>
        {props.showControls && <Icons
            name={'fast-forward'}
            color={'#ff5000'}
            size={40}
        />}
    </TouchableOpacity>

</View>)

ScreenButtons.propTypes = {
    onPress: PropTypes.func
}

ScreenButtons.defaultProps = {
    onPress: undefined
}

export {ScreenButtons}