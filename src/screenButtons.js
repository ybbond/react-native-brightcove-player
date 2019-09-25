import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Icons from 'react-native-vector-icons/MaterialIcons'
import {ToggleIcon} from "./ToggleIcon";

const styles = StyleSheet.create({
    btnContainer: {
        alignItems: 'center',
        backgroundColor,
        justifyContent: 'center'
    }
})

const ScreenButtons = (props) => {
    return <View style={{
        color: 'red',
        zIndex: 1000,
        position: 'absolute',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        height: '80%',
        alignContent: 'stretch'
    }}>
        <View style={{display: 'flex', flexGrow: 1}}>
        </View>
        <TouchableOpacity style={{display: 'flex', flexGrow: 1}} onPress={props.onPress()}>

        </TouchableOpacity>
        <View style={{display: 'flex', flexGrow: 1}}>
        </View>

    </View>
}

ScreenButtons.propTypes = {
    onPress: PropTypes.func
}

ScreenButtons.defaultProps = {
    onPress: undefined
}

export { ScreenButtons }