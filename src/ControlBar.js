import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import LinearGradient from './gradient/index'
import { ToggleIcon} from './ToggleIcon'
import {Time } from './Time'
import {Scrubber} from './Scrubber'
import {QualityControl} from "./qualityControl";
import {GoLive} from "./GoLive";

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'flex-end',
        bottom: -10
    }
})

const ControlBar = (props) => {
    const {
        onSeek,
        onSeekRelease,
        progress,
        currentTime,
        duration,
        theme
    } = props

    return (
        <View>
            <View style={{display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginHorizontal: 8}}>
                <Time time={currentTime} theme={theme.seconds} />
                {duration <= 0 && <GoLive theme={theme.seconds} seekToLive = {() => props.seekToLive()}/>}
            </View>
            <Scrubber
                onSeek={pos => onSeek(pos)}
                onSeekRelease={pos => onSeekRelease(pos)}
                progress={progress}
                theme={{scrubberThumb: theme.scrubberThumb, scrubberBar: theme.scrubberBar}}
                fullScreen = {props.fullScreen}
            />
        </View>
    )
}

ControlBar.propTypes = {
    toggleFS: PropTypes.func.isRequired,
    toggleMute: PropTypes.func.isRequired,
    onSeek: PropTypes.func.isRequired,
    onSeekRelease: PropTypes.func.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    muted: PropTypes.bool.isRequired,
    inlineOnly: PropTypes.bool.isRequired,
    progress: PropTypes.number.isRequired,
    currentTime: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    theme: PropTypes.object.isRequired,
    seekToLive: PropTypes.func.isRequired
}

export { ControlBar }
