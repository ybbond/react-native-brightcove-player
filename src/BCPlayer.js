"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_native_1 = require("react-native");
const BrightcovePlayer_1 = require("./BrightcovePlayer");
const Orientation = require("react-native-orientation");
const Events_1 = require("./Events");
const ControlBar_1 = require("./ControlBar");
const screenButtons_1 = require("./screenButtons");
const qualityOverlayButtons_1 = require("./qualityOverlayButtons");
const fade_anim_1 = require("./fade-anim");
const ToggleIcon_1 = require("./ToggleIcon");
const qualityControl_1 = require("./qualityControl");
const PlayerEventTypes_1 = require("./PlayerEventTypes");
const FORWARD_CONTROL = 5;
const qualityContent = ['Auto', 'High', 'Medium', 'Data Saver'];
// Wraps the Brightcove player with special Events
const BrightcovePlayerWithEvents = Events_1.default(BrightcovePlayer_1.default);
const quality = [0, 750000, 500000, 120000];
const Win = react_native_1.Dimensions.get('window');
const backgroundColor = '#000';
const styles = react_native_1.StyleSheet.create({
    background: {
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 98
    },
    fullScreen: Object.assign({}, react_native_1.StyleSheet.absoluteFillObject),
    image: Object.assign(Object.assign({}, react_native_1.StyleSheet.absoluteFillObject), { width: undefined, height: undefined, zIndex: 99 }),
    topMenu: {
        zIndex: 100,
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#00000080'
    },
    topSubMenu: {
        display: 'flex',
        flexDirection: 'row-reverse',
        zIndex: 1000
    },
    bottomBar: {
        zIndex: 1900,
        position: 'absolute',
        width: '100%',
    },
    loader: {
        zIndex: 99,
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderContainer: {
        width: 40,
        height: 40,
    },
    controlsVisibility: {
        zIndex: 10000,
        position: 'absolute',
        width: '100%',
        height: '100%'
    }
});
class BCPlayer extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {
            paused: !props.autoPlay,
            fullScreen: false,
            inlineHeight: Win.width * 0.5625,
            percentageTracked: { Q1: false, Q2: false, Q3: false, Q4: false },
            onRotate: false,
            appState: react_native_1.AppState.currentState,
            muted: false,
            loading: false,
            duration: 0,
            progress: 0,
            currentTime: 0,
            seeking: false,
            renderError: false,
            qualityControlMenu: false,
            bitRate: 0,
            showControls: true,
            showClickOverlay: false,
            seconds: 0,
            controlsOverlayClicked: false,
            isInLiveEdge: true,
            liveEdge: 0,
            selectedQualityIndex: 0,
            completed: false,
        };
        this.animInline = new react_native_1.Animated.Value(Win.width * 0.5625);
        this.animFullscreen = new react_native_1.Animated.Value(Win.width * 0.5625);
        this.BackHandler = this.BackHandler.bind(this);
        this._handleAppStateChange = this._handleAppStateChange.bind(this);
        this.onAnimEnd = this.onAnimEnd.bind(this);
        this.onRotated = this.onRotated.bind(this);
    }
    componentWillMount() {
        // The getOrientation method is async. It happens sometimes that
        // you need the orientation at the moment the JS runtime starts running on device.
        // `getInitialOrientation` returns directly because its a constant set at the
        // beginning of the JS runtime.
        // Remember to remove listener
    }
    componentDidMount() {
        this.setState({ paused: false });
        react_native_1.Dimensions.addEventListener('change', this.onRotated);
        react_native_1.BackHandler.addEventListener('hardwareBackPress', this.BackHandler);
        react_native_1.AppState.addEventListener('change', this._handleAppStateChange);
        this.setTimer();
    }
    setTimer() {
        this.timer = setInterval(() => {
            switch (true) {
                case this.state.seeking:
                    // do nothing
                    break;
                case this.state.controlsOverlayClicked:
                    this.setState({ seconds: 0, controlsOverlayClicked: false });
                    break;
                case this.state.showClickOverlay:
                    break;
                case this.state.seconds > 3:
                    this.setState({
                        showControls: false,
                        seconds: 0
                    });
                    break;
                default:
                    this.setState({ seconds: this.state.seconds + 1 });
            }
        }, 1000);
    }
    _handleAppStateChange(nextAppState) {
        if (this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active') {
            this.player && this.player.playVideo(true);
            if (this.state.fullScreen) {
                this.player && this.player.setFullscreen(false);
            }
        }
        this.setState({ appState: nextAppState });
    }
    componentWillUnmount() {
        react_native_1.BackHandler.removeEventListener('hardwareBackPress', this.BackHandler);
        react_native_1.Dimensions.removeEventListener('change', this.onRotated);
        react_native_1.AppState.removeEventListener('change', this._handleAppStateChange);
        clearInterval(this.timer);
    }
    onRotated({ window: { width, height } }) {
        // Add this condition incase if inline and fullscreen options are turned on
        if (this.props.inlineOnly)
            return;
        const orientation = width > height ? 'LANDSCAPE' : 'PORTRAIT';
        if (this.props.rotateToFullScreen) {
            if (orientation === 'LANDSCAPE') {
                this.setState({ fullScreen: true }, () => {
                    this.animToFullscreen(height);
                    this.props.onFullScreen(this.state.fullScreen);
                });
                return;
            }
            if (orientation === 'PORTRAIT') {
                this.setState({
                    fullScreen: false,
                    paused: this.props.fullScreenOnly || this.state.paused
                }, () => {
                    this.animToInline();
                    if (this.props.fullScreenOnly)
                        this.props.onPlay(!this.state.paused);
                    this.props.onFullScreen(this.state.fullScreen);
                });
                return;
            }
        }
        else {
            this.animToInline();
        }
        if (this.state.fullScreen)
            this.animToFullscreen(height);
    }
    BackHandler() {
        if (this.state.fullScreen) {
            this.player && this.player.setFullscreen(false);
            return true;
        }
        return false;
    }
    seekToLive() {
        if (this.state.liveEdge) {
            this.setState({ currentTime: this.state.liveEdge }, () => {
                this.progress({ currentTime: this.state.currentTime, liveEdge: this.state.liveEdge, duration: 0, isInLiveEdge: undefined });
                this.player && this.player.seekToLive();
                this.forcePlay();
                this.props.onEvent && this.props.onEvent({ 'type': PlayerEventTypes_1.PlayerEventTypes.SEEK_TO_LIVE });
            });
        }
    }
    toggleFS() {
        this.setState({ fullScreen: !this.state.fullScreen }, () => {
            if (this.state.fullScreen) {
                const height = this.state.onRotate ? react_native_1.Dimensions.get('window').height : react_native_1.Dimensions.get('window').width;
                this.props.onFullScreen && this.props.onFullScreen(this.state.fullScreen);
                if (!this.state.onRotate)
                    Orientation.lockToLandscape();
                this.animToFullscreen(height);
            }
            else {
                if (this.props.fullScreenOnly) {
                    this.setState({ paused: true }, () => this.props.onPlay(!this.state.paused));
                }
                this.props.onFullScreen && this.props.onFullScreen(this.state.fullScreen);
                if (!this.state.onRotate)
                    Orientation.lockToPortrait();
                this.animToInline();
                setTimeout(() => {
                    if (!this.props.lockPortraitOnFsExit)
                        Orientation.unlockAllOrientations();
                }, 1500);
            }
            this.setState({ onRotate: false });
        });
    }
    animToFullscreen(height) {
        react_native_1.Animated.parallel([
            react_native_1.Animated.timing(this.animFullscreen, { toValue: height, duration: 200 }),
            react_native_1.Animated.timing(this.animInline, { toValue: height, duration: 200 })
        ]).start();
    }
    animToInline(height) {
        const newHeight = height || this.state.inlineHeight;
        react_native_1.Animated.parallel([
            react_native_1.Animated.timing(this.animFullscreen, { toValue: newHeight, duration: 100 }),
            react_native_1.Animated.timing(this.animInline, { toValue: this.state.inlineHeight, duration: 100 })
        ]).start();
    }
    setDuration(duration) {
        this.setState({ duration: duration });
    }
    toggleMute() {
        this.setState({
            muted: !this.state.muted,
            controlsOverlayClicked: true
        });
    }
    seek(percent) {
        const currentTime = percent * this.state.duration;
        this.setState({
            seeking: true,
            currentTime,
            controlsOverlayClicked: true
        });
    }
    seekTo(seconds) {
        const percent = seconds / this.state.duration;
        if (seconds > this.state.duration) {
            // throw new Error(`Current time (${seconds}) exceeded the duration ${this.state.duration}`)
            return;
        }
        return this.onSeekRelease(percent);
    }
    onSeekRelease(percent) {
        const seconds = this.state.liveEdge && this.state.liveEdge > 0 ? percent * this.state.liveEdge : percent * this.state.duration;
        this.setState({ progress: percent, completed: false, seeking: false, currentTime: (this.state.liveEdge && this.state.liveEdge < 1) && (this.state.duration <= seconds) ? this.state.duration - .01 : seconds }, () => {
            this.player && this.player.seekTo((this.state.liveEdge && this.state.liveEdge < 1) && (this.state.duration <= seconds) ? this.state.duration - 0.01 : seconds);
            this.props.onEvent && this.props.onEvent({ 'type': PlayerEventTypes_1.PlayerEventTypes.SEEK_TO, time: seconds });
            this.forcePlay();
        });
    }
    progress(time) {
        const { currentTime, duration, isInLiveEdge, liveEdge } = time;
        const progress = currentTime / (liveEdge && liveEdge > 0 ? liveEdge : duration);
        if (!this.state.seeking) {
            this.setState({ progress, currentTime, isInLiveEdge, liveEdge });
        }
    }
    toggleQualityOverlay() {
        this.setState({
            qualityControlMenu: !this.state.qualityControlMenu,
            controlsOverlayClicked: true
        });
    }
    toggleQuality(value) {
        this.setState({
            qualityControlMenu: !this.state.qualityControlMenu,
            controlsOverlayClicked: true,
            bitRate: (value !== null && value >= 0) ? quality[value] : this.state.bitRate,
            selectedQualityIndex: (value !== null && value >= 0) ? value : this.state.selectedQualityIndex
        }, () => {
            this.props.onEvent && this.props.onEvent({ 'type': PlayerEventTypes_1.PlayerEventTypes.QUALITY_SELECTED, bitRate: qualityContent[value] });
        });
    }
    togglePlay() {
        this.setState({
            paused: !this.state.paused,
            controlsOverlayClicked: true
        }, () => {
            this.player && this.player.playVideo(!this.state.paused);
            if (this.state.paused)
                this.props.onEvent && this.props.onEvent({ 'type': PlayerEventTypes_1.PlayerEventTypes.PAUSE });
        });
    }
    forcePlay() {
        this.setState({
            paused: false,
            controlsOverlayClicked: true
        }, () => {
            this.player && this.player.playVideo(true);
        });
    }
    // openAirplay() {
    //     this.player && this.player.createAirplayIconOverlay();
    // }
    forward() {
        this.setState({
            controlsOverlayClicked: true,
            currentTime: (Math.floor(this.state.currentTime) <= Math.floor(this.state.liveEdge) || Math.floor(this.state.currentTime) <= Math.floor(this.state.duration)) ? (this.state.currentTime + FORWARD_CONTROL) : this.state.currentTime
        }, () => {
            this.player && this.player.seekTo(this.state.currentTime + FORWARD_CONTROL);
            this.props.onEvent && this.props.onEvent({ 'type': PlayerEventTypes_1.PlayerEventTypes.FORWARD });
        });
    }
    rewind() {
        if (this.state.completed)
            this.forcePlay();
        this.setState({
            controlsOverlayClicked: true,
            currentTime: ((this.state.currentTime - FORWARD_CONTROL) >= 0) ? this.state.currentTime - FORWARD_CONTROL : this.state.currentTime,
            completed: false
        }, () => {
            if ((this.state.currentTime - FORWARD_CONTROL) >= 0) {
                this.player && this.player.seekTo(this.state.currentTime - FORWARD_CONTROL);
                this.props.onEvent && this.props.onEvent({ 'type': PlayerEventTypes_1.PlayerEventTypes.REWIND });
            }
        });
    }
    onAnimEnd() {
        this.setState({ showClickOverlay: !this.state.showControls });
    }
    replay() {
        this.player && this.player.seekTo(0);
        this.player && this.player.playVideo(true);
        this.setState({ currentTime: 0, paused: false, completed: false }, () => {
            this.progress({ currentTime: this.state.currentTime, duration: this.state.duration, isInLiveEdge: undefined, liveEdge: undefined });
            this.props.onEvent && this.props.onEvent({ 'type': PlayerEventTypes_1.PlayerEventTypes.REPLAY });
        });
    }
    overlayClick() {
        this.setState({ showControls: false });
    }
    render() {
        const theme = {
            title: '#fff',
            fullscreen: '#fff',
            scrubberThumb: '#ff5000',
            scrubberBar: '#ff5000',
            seconds: '#fff',
            duration: '#ff5000',
            progress: '#ff5000',
            loading: '#fff',
            screenButtons: '#fff',
            qualityControl: '#fff'
        };
        const { fullScreen, paused, bitRate, progress, duration, currentTime, qualityControlMenu, loading, showControls, showClickOverlay, selectedQualityIndex, isInLiveEdge, muted, completed, liveEdge } = this.state;
        const { style } = this.props;
        const AnimView = showControls ? fade_anim_1.FadeInAnim : fade_anim_1.FadeOutAnim;
        // @ts-ignore
        return (React.createElement(react_native_1.View, null,
            loading && React.createElement(react_native_1.View, { style: styles.loader },
                React.createElement(react_native_1.View, { style: { position: 'absolute', left: '45%', top: '43%', zIndex: 4000 } },
                    React.createElement(react_native_1.ActivityIndicator, { size: "large", color: "#fff" }))),
            React.createElement(AnimView, { style: styles.topMenu, onEnd: this.onAnimEnd, onOverlayClick: () => this.setState({ controlsOverlayClicked: !this.state.controlsOverlayClicked }) },
                React.createElement(React.Fragment, null,
                    React.createElement(react_native_1.SafeAreaView, { style: styles.topSubMenu },
                        React.createElement(ToggleIcon_1.ToggleIcon, { onPress: () => this.toggleFS(), iconOff: "fullscreen", iconOn: "fullscreen-exit", isOn: fullScreen, theme: theme.fullscreen, size: 35 }),
                        React.createElement(qualityControl_1.QualityControl, { theme: theme.qualityControl, toggleQuality: () => this.toggleQualityOverlay(), paddingRight: 10, selectedOption: selectedQualityIndex })),
                    qualityControlMenu &&
                        React.createElement(qualityOverlayButtons_1.QualityOverlayButtons, { onPress: (value) => this.toggleQuality(value), qualityContent: qualityContent, selectedQualityIndex: selectedQualityIndex }),
                    React.createElement(screenButtons_1.ScreenButtons, { togglePlay: () => this.togglePlay(), forcePlay: () => this.forcePlay(), loading: loading, forward: () => this.forward(), rewind: () => this.rewind(), theme: theme, paused: paused, completed: completed, replay: () => this.replay(), onOverlayClick: () => this.overlayClick(), showForward: (liveEdge && liveEdge > 0) ? (liveEdge - currentTime) > 10 : (duration - currentTime) > 10, showBackward: currentTime > 10 }),
                    React.createElement(react_native_1.View, { style: [styles.bottomBar, (react_native_1.Platform.OS === 'ios' && this.state.fullScreen) ? { bottom: 15 } : { bottom: 0 }] },
                        React.createElement(ControlBar_1.ControlBar, { onSeek: (pos) => this.seek(pos), onSeekRelease: (pos) => this.onSeekRelease(pos), progress: progress, currentTime: currentTime, theme: theme, duration: duration, isInLiveEdge: isInLiveEdge, seekToLive: () => this.seekToLive(), liveEdge: liveEdge })))),
            showClickOverlay &&
                React.createElement(react_native_1.TouchableOpacity, { style: styles.controlsVisibility, onPress: () => this.setState({ showControls: true }) }),
            React.createElement(react_native_1.Animated.View, { style: [
                    styles.background,
                    fullScreen ?
                        (styles.fullScreen, { height: this.animFullscreen })
                        : { height: this.animInline },
                    fullScreen ? null : style
                ] },
                React.createElement(react_native_1.StatusBar, { hidden: fullScreen }),
                React.createElement(BrightcovePlayerWithEvents, Object.assign({ ref: (player) => this.player = player }, this.props, { style: this.props.style, playerId: this.props.playerId ? this.props.playerId : `com.brightcove/react-native/${react_native_1.Platform.OS}`, onBeforeEnterFullscreen: this.toggleFS.bind(this), onBeforeExitFullscreen: this.toggleFS.bind(this), disableDefaultControl: true, onChangeDuration: (duration) => this.setDuration(duration.duration), onProgress: (e) => this.progress(e), volume: muted ? 0 : 10, bitRate: bitRate, onBufferingStarted: () => this.setState({ loading: true }), onBufferingCompleted: () => this.setState({ loading: false }), onEnd: () => this.setState({ completed: true }), autoPlay: true })))));
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
};
module.exports = BCPlayer;
//# sourceMappingURL=BCPlayer.js.map