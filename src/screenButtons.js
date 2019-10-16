import React from 'react'
import PropTypes from 'prop-types'
import {View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Animated} from 'react-native'
import Icons from 'react-native-vector-icons/MaterialIcons'
import FICons from 'react-native-vector-icons/FontAwesome'

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
        flex: 1,
        flexBasis: 40
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
        alignItems: 'center'
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonContentTxt: {
        color: 'white',
        display: 'flex',
        fontWeight: 'bold',
        fontSize: 18,
        paddingTop: 3
    },
    buttonContentIcon: {
        color: 'white',
        display: 'flex'
    }
})

const ScreenButtons = (props) => {
    const onPress = () => {
        if (props.completed) {
            props.replay()
            props.forcePlay()

        } else {
            props.togglePlay()

        }

    }
    return (<TouchableOpacity style={styles.btnContainer} onPress={props.onOverlayClick()}>
        <View style={[styles.individualButton, styles.rewindButton]}>
            <TouchableOpacity onPress={() => props.rewind()}>
                <View style={styles.buttonContainer}>
                    <View style={styles.buttonContentIcon}>
                        <FICons
                            name={'angle-double-left'}
                            color={props.theme.screenButtons}
                            size={40}
                        />
                    </View><Text
                    style={styles.buttonContentTxt}>10</Text>
                </View>
            </TouchableOpacity>
        </View>
        <View style={[styles.individualButton, styles.centerButton]}>

            {!props.loading && <TouchableOpacity onPress={() => onPress()}><Icons
                name={props.completed ? 'replay' : props.paused ? 'play-arrow' : 'pause'}
                color={props.theme.screenButtons}
                size={props.completed ? 32 : 40}
            /></TouchableOpacity>}
        </View>
        <View style={[styles.individualButton, styles.forwardButton]}>
            <TouchableOpacity onPress={() => props.forward()}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.buttonContentTxt}>10</Text>
                    <View style={styles.buttonContentIcon}>
                        <FICons
                            name={'angle-double-right'}
                            color={props.theme.screenButtons}
                            size={40}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </View>

    </TouchableOpacity>)
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
