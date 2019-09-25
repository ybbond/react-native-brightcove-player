import React, {Component} from 'react'
import {
    Animated,
    AppState,
    AppStateStatus,
    BackHandler,
    Dimensions,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native'
import BrightcovePlayer from './BrightcovePlayer'
import Orientation from 'react-native-orientation'
import withEvents from './Events'
import {ControlBar} from "./ControlBar";

// Wraps the Brightcove player with special Events
const BrightcovePlayerWithEvents = withEvents(BrightcovePlayer)

const Win = Dimensions.get('window')
const backgroundColor = '#000'

const styles = StyleSheet.create({
    background: {
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 98
    },
    fullScreen: {
        ...StyleSheet.absoluteFillObject
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        width: undefined,
        height: undefined,
        zIndex: 99
    }
})

class BCPlayer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            paused: false,
            fullScreen: false,
            inlineHeight: Win.width * 0.5625,
            percentageTracked: {Q1: false, Q2: false, Q3: false, Q4: false},
            mediainfo: null,
            onRotate: false,
            appState: AppState.currentState,
            muted: false,
            loading: false,
            duration: 0,
            progress: 0,
            currentTime: 0,
            seeking: false,
            renderError: false
        }
        this.animInline = new Animated.Value(Win.width * 0.5625)
        this.animFullscreen = new Animated.Value(Win.width * 0.5625)
        this.BackHandler = this.BackHandler.bind(this)
        this.orientationDidChange = this.orientationDidChange.bind(this)
        this._handleAppStateChange = this._handleAppStateChange.bind(this)
    }

    componentWillMount() {
        // The getOrientation method is async. It happens sometimes that
        // you need the orientation at the moment the JS runtime starts running on device.
        // `getInitialOrientation` returns directly because its a constant set at the
        // beginning of the JS runtime.
        // Remember to remove listener
        Orientation.removeOrientationListener(this.orientationDidChange)
    }

    componentDidMount() {
        Orientation.addOrientationListener(this.orientationDidChange)
        BackHandler.addEventListener('hardwareBackPress', this.BackHandler)
        AppState.addEventListener('change', this._handleAppStateChange)
    }

    _handleAppStateChange(nextAppState: AppStateStatus) {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active') {
            if (this.state.fullScreen) {
                this.player.setFullscreen(false)
            }
        }
        this.setState({appState: nextAppState})
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.BackHandler)
        Orientation.removeOrientationListener(this.orientationDidChange)
        AppState.removeEventListener('change', this._handleAppStateChange)
    }

    orientationDidChange(orientation) {
        if (this.props.rotateToFullScreen) {
            if (orientation === 'LANDSCAPE' && !this.state.fullScreen) {
                this.setState({onRotate: true}, () => {
                    this.player.setFullscreen && this.player.setFullscreen(true)
                })
                return
            }
            if (orientation === 'PORTRAIT' && this.state.fullScreen) {
                this.setState({onRotate: true}, () => {
                    this.player.setFullscreen && this.player.setFullscreen(false)
                })
                return
            }
        }
    }

    BackHandler() {
        if (this.state.fullScreen) {
            this.player.setFullscreen(false)
            return true
        }
        return false
    }

    playVideo() {
        this.player.playVideo(true)
    }

    setBitRate() {
        this.player.setBitRate(240)
    }

    toggleFS() {
        this.setState({fullScreen: !this.state.fullScreen}, () => {
            if (this.state.fullScreen) {
                const initialOrient = Orientation.getInitialOrientation()
                const height = this.state.onRotate ? Dimensions.get('window').height : Dimensions.get('window').width
                this.props.onFullScreen && this.props.onFullScreen(this.state.fullScreen)
                if (!this.state.onRotate) Orientation.lockToLandscape()
                this.animToFullscreen(height)
            } else {
                if (this.props.fullScreenOnly) {
                    this.setState({paused: true}, () => this.props.onPlay(!this.state.paused))
                }
                this.props.onFullScreen && this.props.onFullScreen(this.state.fullScreen)
                if (!this.state.onRotate) Orientation.lockToPortrait()
                this.animToInline()
                setTimeout(() => {
                    if (!this.props.lockPortraitOnFsExit) Orientation.unlockAllOrientations()
                }, 1500)
            }
            this.setState({onRotate: false})
        })
    }

    animToFullscreen(height) {
        Animated.parallel([
            Animated.timing(this.animFullscreen, {toValue: height, duration: 200}),
            Animated.timing(this.animInline, {toValue: height, duration: 200})
        ]).start()
    }

    animToInline(height) {
        const newHeight = height || this.state.inlineHeight
        Animated.parallel([
            Animated.timing(this.animFullscreen, {toValue: newHeight, duration: 100}),
            Animated.timing(this.animInline, {toValue: this.state.inlineHeight, duration: 100})
        ]).start()
    }

    setDuration(duration) {
        this.setState({duration : duration.duration})
    }

    toggleMute() {
        this.setState({ muted: !this.state.muted })
    }

    seek(percent) {
        const currentTime = percent * this.state.duration
        this.setState({ seeking: true, currentTime })
    }

    seekTo(seconds) {
        const percent = seconds / this.state.duration
        if (seconds > this.state.duration) {
            throw new Error(`Current time (${seconds}) exceeded the duration ${this.state.duration}`)
            return false
        }
        return this.onSeekRelease(percent)
    }

    onSeekRelease(percent) {
        const seconds = percent * this.state.duration
        this.setState({ progress: percent, seeking: false }, () => {
            this.player.seekTo(seconds)
        })
    }

    progress(time) {
        const { currentTime, duration} = time
        const progress = currentTime / duration
        if (!this.state.seeking) {
            this.setState({ progress, currentTime }, () => {
                // this.props.onProgress(time)
            })
        }
    }

    toggleMute() {
        this.setState({ muted: !this.state.muted })
    }

    togglePlay() {
        this.setState({paused: !this.state.paused}, () => this.player.playVideo(this.state.paused))
        // this.setState({ paused: !this.state.paused }, () => {
        //     this.props.onPlay(!this.state.paused)
        //     Orientation.getOrientation((e, orientation) => {
        //         if (this.props.inlineOnly) return
        //         if (!this.state.paused) {
        //             if (this.props.fullScreenOnly && !this.state.fullScreen) {
        //                 this.setState({ fullScreen: true }, () => {
        //                     this.props.onFullScreen(this.state.fullScreen)
        //                     const initialOrient = Orientation.getInitialOrientation()
        //                     const height = orientation !== initialOrient ?
        //                         Win.width : Win.height
        //                     this.animToFullscreen(height)
        //                     if (this.props.rotateToFullScreen) Orientation.lockToLandscape()
        //                 })
        //             }
        //             KeepAwake.activate()
        //         } else {
        //             KeepAwake.deactivate()
        //         }
        //     })
        // })
    }


    render() {
        const theme = {
            title: '#ff5000',
            more: '#ff5000',
            center: '#ff5000',
            fullscreen: '#ff5000',
            volume: '#ff5000',
            scrubberThumb: '#ff5000',
            scrubberBar: '#ff5000',
            seconds: '#ff5000',
            duration: '#ff5000',
            progress: '#ff5000',
            loading: '#ff5000'
        }
        const {
            fullScreen,
            paused,
            muted,
            progress,
            duration,
            currentTime
        } = this.state

        const {
            style
        } = this.props

        return (
            <View>
                {/*<Text style={{color: 'red', zIndex: 1001, position: 'absolute'}} onPress={this.playVideo.bind(this)}>*/}
                {/*    Fuck You*/}
                {/*</Text>*/}
                <View style={{color: 'red', zIndex: 1000, position: 'absolute', width: '100%', display: 'flex',flexDirection: 'row', height: '80%', alignContent: 'stretch' }}>
                    <View style={{display: 'flex', flexGrow: 1}}>
                    </View>
                    <TouchableOpacity style={{display: 'flex', flexGrow: 1}} onPress={this.togglePlay.bind(this)}>

                    </TouchableOpacity>
                    <View style={{display: 'flex', flexGrow: 1}}>
                    </View>

                </View>
                <View style={{color: 'red', zIndex: 1000, position: 'absolute', width: '100%', bottom: 0}}>
                    <ControlBar
                        toggleFS={() => this.toggleFS()}
                        toggleMute={() => this.toggleMute()}
                        togglePlay={() => this.playVideo()}
                        muted={muted}
                        fullscreen={fullScreen}
                        onSeek={pos => this.seek(pos)}
                        onSeekRelease={pos => this.onSeekRelease(pos)}
                        progress={progress}
                        currentTime={currentTime}
                        theme={theme}
                        duration={duration.duration || duration}
                        inlineOnly={false}
                    />
                </View>
                <Animated.View
                    style={[
                        styles.background,
                        fullScreen ?
                            (styles.fullScreen, {height: this.animFullscreen})
                            : {height: this.animInline},
                        fullScreen ? null : style
                    ]}
                >
                    <StatusBar hidden={fullScreen}/>
                    <BrightcovePlayerWithEvents
                        ref={(player) => this.player = player}
                        {...this.props}
                        style={[styles.player, this.props.style]}
                        playerId={this.props.playerId ? this.props.playerId : `com.brightcove/react-native/${Platform.OS}`}
                        onBeforeEnterFullscreen={this.toggleFS.bind(this)}
                        onBeforeExitFullscreen={this.toggleFS.bind(this)}
                        disableDefaultControl={true}
                        onChangeDuration={(duration) => this.setDuration(duration)}
                        onProgress={e => this.progress(e)}
                    />
                </Animated.View>
            </View>
        )
    }

}

BCPlayer.defaultProps = {
    placeholder: undefined,
    style: {},
    autoPlay: false,
    inlineOnly: false,
    fullScreenOnly: false,
    rotateToFullScreen: false,
    lockPortraitOnFsExit: false,
    disableControls: false
}


module.exports = BCPlayer
