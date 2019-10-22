import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import {Time } from './Time'
import {Scrubber} from './Scrubber'
import {GoLive} from "./GoLive";

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'flex-end'
    },
    timerSpace: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
    },
    controlBarContainer: {
        marginHorizontal: 8
    }
})
interface ControlBarProps {
    onSeek: (pos: number) => void
    onSeekRelease: (pos: number) => void
    progress: number
    currentTime: number
    theme: {
        [string: string]: string
    }
    isInLiveEdge: boolean | undefined
    liveEdge: number | undefined
    duration: number
    seekToLive: () => void
}

const ControlBar = (props: ControlBarProps) => {
    const {
        onSeek,
        onSeekRelease,
        progress,
        currentTime,
        theme,
        isInLiveEdge,
        liveEdge,
        duration
    } = props

    return (
        <View style={styles.controlBarContainer}>
            <View style={styles.timerSpace}>
                <Time time={currentTime} theme={theme.seconds} />
                {duration <= 0 && liveEdge && liveEdge > 0 && <GoLive disabled={isInLiveEdge} seekToLive = {() => props.seekToLive()}/>}
            </View>
            <Scrubber
                onSeek={(pos:  number) => onSeek(pos)}
                onSeekRelease={(pos: number) => onSeekRelease(pos)}
                progress={progress}
                theme={{scrubberThumb: theme.scrubberThumb, scrubberBar: theme.scrubberBar}}
            />
        </View>
    )
}


export { ControlBar }
