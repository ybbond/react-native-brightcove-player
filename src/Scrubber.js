import React from 'react' // eslint-disable-line
import PropTypes from 'prop-types'
import {StyleSheet, View} from 'react-native'
import Slider from '@react-native-community/slider'

const ThumbTracker = require('../Resources/controller.png')

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    trackStyle: {
        borderRadius: 1
    }
})

const Scrubber = (props) => {
    const trackColor = 'rgba(255,255,255,0.5)'
    const {progress, theme, onSeek, onSeekRelease} = props
    return (
        <View style={styles.container}>
            <Slider
                onValueChange={val => onSeek(val)}
                onSlidingComplete={val => onSeekRelease(val)}
                value={progress === Number.POSITIVE_INFINITY ? 0 : progress}
                trackStyle={styles.trackStyle}
                minimumTrackTintColor={theme.scrubberBar}
                maximumTrackTintColor={trackColor}
                trackClickable
                thumbImage={ThumbTracker}
            />
        </View>
    )
}

Scrubber.propTypes = {
    onSeek: PropTypes.func.isRequired,
    onSeekRelease: PropTypes.func.isRequired,
    progress: PropTypes.number.isRequired,
    theme: PropTypes.object.isRequired
}

export {Scrubber}
