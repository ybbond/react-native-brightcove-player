import React from 'react'
import PropTypes from 'prop-types'
import {View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Animated} from 'react-native'
import Icons from "react-native-vector-icons/MaterialIcons";

const styles = StyleSheet.create({
    btnContainer: {
        color: 'red',
        zIndex: 100,
        position: 'absolute',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        alignContent: 'stretch'
    },
    individualButton: {
        display: 'flex',
        flexGrow: 1
    },
    centerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rewindButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    forwardButton : {
        flexDirection: 'row',
        alignItems: 'center',
    }
})

const ScreenButtons = (props) => {
    return ( <View style={styles.btnContainer}>
        <TouchableOpacity style={[styles.individualButton, styles.rewindButton]} onPress={() => props.rewind()}>
            <Icons
                name={'double-arrow'}
                color={props.theme.screenButtons}
                size={40}
            />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.individualButton, styles.centerButton]} onPress={() => props.togglePlay()}>
            {props.loading && <ActivityIndicator size="large" color="#fff"/>}
            {!props.loading && <Icons
                name={props.paused ? 'play-arrow' : 'pause'}
                color={props.theme.screenButtons}
                size={40}
            />}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.individualButton, styles.forwardButton]} onPress={() => props.forward()}>
            <Icons
                name={'double-arrow'}
                color={props.theme.screenButtons}
                size={40}
            />
        </TouchableOpacity>

    </View>)
}

ScreenButtons.propTypes = {
    onPress: PropTypes.func,
    theme: PropTypes.object.isRequired
}

ScreenButtons.defaultProps = {
    onPress: undefined,
    theme: {
        screenButtons: '#fff'
    }
}

export {ScreenButtons}
