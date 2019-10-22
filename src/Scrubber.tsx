import * as React from 'react'
import {
    View,
    Platform,
    StyleSheet,
    Slider as RNSlider
} from 'react-native'
import Slider from '@react-native-community/slider'
const ThumbTracker = require('../Resources/controller.png')

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    slider: {
        marginHorizontal: -15,
    },
    trackStyle: {
        borderRadius: 1
    },
    sliderFullScreen: {
        marginHorizontal: -15,
        marginBottom:0
    }
})

interface ScrubberProps {
    progress: number
    theme: {
        [string:  string]:string
    }
    onSeek: (val: number)=> void
    onSeekRelease: (val: number)=> void
}
const Scrubber = (props: ScrubberProps) => {
    const trackColor = 'rgba(255,255,255,0.5)'
    const { progress, theme, onSeek, onSeekRelease } = props
    return (
        <View style={styles.container}>
            { Platform.OS === 'ios' ?
                <Slider
                    onValueChange={val => onSeek(val)}
                    onSlidingComplete={val => onSeekRelease(val)}
                    value={progress === Number.POSITIVE_INFINITY ? 0 : progress}
                    minimumTrackTintColor={theme.scrubberBar}
                    maximumTrackTintColor={trackColor}
                    thumbImage={ThumbTracker}
                />
                :
                <RNSlider
                    style={styles.slider}
                    onValueChange={val => onSeek(val)}
                    onSlidingComplete={val => onSeekRelease(val)}
                    value={progress}
                    thumbTintColor={"#e8e8e8"}
                    minimumTrackTintColor={theme.scrubberBar}
                    maximumTrackTintColor={trackColor}
                />
            }
        </View>
    )
}


export { Scrubber }
