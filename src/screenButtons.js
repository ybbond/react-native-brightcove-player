import React from 'react'
import PropTypes from 'prop-types'
import {View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Animated} from 'react-native'
import Icons from "react-native-vector-icons/MaterialIcons";
import FICons from "react-native-vector-icons/FontAwesome";

const styles = StyleSheet.create({
    btnContainer: {
        color: 'red',
        zIndex: 1,
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
    forwardButton: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})

const ScreenButtons = (props) => {
    const onPress = () => {
        !props.completed ? null : props.seekTo(0);
        props.togglePlay(true)

    }
    return (<View style={styles.btnContainer}>
        <View style={[styles.individualButton, styles.rewindButton]}>
            <TouchableOpacity onPress={() => props.rewind()}>
                <FICons
                    name={'angle-double-left'}
                    color={props.theme.screenButtons}
                    size={40}
                />
            </TouchableOpacity>
        </View>
        <View style={[styles.individualButton, styles.centerButton]}>

            {!props.loading && <TouchableOpacity onPress={() => onPress()}><Icons
                name={props.completed ? 'replay' : props.paused ? 'play-arrow' : 'pause'}
                color={props.theme.screenButtons}
                size={props.completed ? 32 : 40}
            /></TouchableOpacity>}
        </View>
        <View style={[styles.individualButton, styles.forwardButton]} >
            <TouchableOpacity onPress={() => props.forward()}><FICons
                name={'angle-double-right'}
                color={props.theme.screenButtons}
                size={40}
            />
            </TouchableOpacity>
        </View>

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