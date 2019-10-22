"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var BrightcovePlayer_1 = require("./BrightcovePlayer");
var react_native_orientation_1 = require("react-native-orientation");
var Events_1 = require("./Events");
var ControlBar_1 = require("./ControlBar");
var screenButtons_1 = require("./screenButtons");
var qualityOverlayButtons_1 = require("./qualityOverlayButtons");
var fade_anim_1 = require("./fade-anim");
var ToggleIcon_1 = require("./ToggleIcon");
var qualityControl_1 = require("./qualityControl");
var PlayerEventTypes_1 = require("./PlayerEventTypes");
var FORWARD_CONTROL = react_native_1.Platform.OS === 'ios' ? 5 : 10;
var qualityContent = ['Auto', 'High', 'Medium', 'Data Saver'];
var quality = [0, 750000, 500000, 120000];
// Wraps the Brightcove player with special Events
var BrightcovePlayerWithEvents = Events_1.default(BrightcovePlayer_1.default);
var Win = react_native_1.Dimensions.get('window');
var backgroundColor = '#000';
var styles = react_native_1.StyleSheet.create({
    background: {
        backgroundColor: backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 98
    },
    fullScreen: __assign({}, react_native_1.StyleSheet.absoluteFillObject),
    image: __assign({}, react_native_1.StyleSheet.absoluteFillObject, { width: undefined, height: undefined, zIndex: 99 }),
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
var BCPlayer = /** @class */ (function (_super) {
    __extends(BCPlayer, _super);
    function BCPlayer(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            paused: !props.autoPlay,
            fullScreen: false,
            inlineHeight: Win.width * 0.5625,
            percentageTracked: { Q1: false, Q2: false, Q3: false, Q4: false },
            mediainfo: null,
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
        _this.animInline = new react_native_1.Animated.Value(Win.width * 0.5625);
        _this.animFullscreen = new react_native_1.Animated.Value(Win.width * 0.5625);
        _this.BackHandler = _this.BackHandler.bind(_this);
        _this._handleAppStateChange = _this._handleAppStateChange.bind(_this);
        _this.onAnimEnd = _this.onAnimEnd.bind(_this);
        _this.onRotated = _this.onRotated.bind(_this);
        return _this;
    }
    BCPlayer.prototype.componentWillMount = function () {
        // The getOrientation method is async. It happens sometimes that
        // you need the orientation at the moment the JS runtime starts running on device.
        // `getInitialOrientation` returns directly because its a constant set at the
        // beginning of the JS runtime.
        // Remember to remove listener
    };
    BCPlayer.prototype.componentDidMount = function () {
        this.setState({ paused: false });
        react_native_1.Dimensions.addEventListener('change', this.onRotated);
        react_native_1.BackHandler.addEventListener('hardwareBackPress', this.BackHandler);
        react_native_1.AppState.addEventListener('change', this._handleAppStateChange);
        this.setTimer();
    };
    BCPlayer.prototype.setTimer = function () {
        var _this = this;
        this.timer = setInterval(function () {
            switch (true) {
                case _this.state.seeking:
                    // do nothing
                    break;
                case _this.state.controlsOverlayClicked:
                    _this.setState({ seconds: 0, controlsOverlayClicked: false });
                    break;
                case _this.state.showClickOverlay:
                    break;
                case _this.state.seconds > 3:
                    _this.setState({
                        showControls: false,
                        seconds: 0
                    });
                    break;
                default:
                    _this.setState({ seconds: _this.state.seconds + 1 });
            }
        }, 1000);
    };
    BCPlayer.prototype._handleAppStateChange = function (nextAppState) {
        if (this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active') {
            this.player && this.player.playVideo(true);
            if (this.state.fullScreen) {
                this.player && this.player.setFullscreen(false);
            }
        }
        this.setState({ appState: nextAppState });
    };
    BCPlayer.prototype.componentWillUnmount = function () {
        react_native_1.BackHandler.removeEventListener('hardwareBackPress', this.BackHandler);
        react_native_1.Dimensions.removeEventListener('change', this.onRotated);
        react_native_1.AppState.removeEventListener('change', this._handleAppStateChange);
        clearInterval(this.timer);
    };
    BCPlayer.prototype.onRotated = function (_a) {
        var _this = this;
        var _b = _a.window, width = _b.width, height = _b.height;
        // Add this condition incase if inline and fullscreen options are turned on
        if (this.props.inlineOnly)
            return;
        var orientation = width > height ? 'LANDSCAPE' : 'PORTRAIT';
        if (this.props.rotateToFullScreen) {
            if (orientation === 'LANDSCAPE') {
                this.setState({ fullScreen: true }, function () {
                    _this.animToFullscreen(height);
                    _this.props.onFullScreen(_this.state.fullScreen);
                });
                return;
            }
            if (orientation === 'PORTRAIT') {
                this.setState({
                    fullScreen: false,
                    paused: this.props.fullScreenOnly || this.state.paused
                }, function () {
                    _this.animToInline();
                    if (_this.props.fullScreenOnly)
                        _this.props.onPlay(!_this.state.paused);
                    _this.props.onFullScreen(_this.state.fullScreen);
                });
                return;
            }
        }
        else {
            this.animToInline();
        }
        if (this.state.fullScreen)
            this.animToFullscreen(height);
    };
    BCPlayer.prototype.BackHandler = function () {
        if (this.state.fullScreen) {
            this.player && this.player.setFullscreen(false);
            return true;
        }
        return false;
    };
    BCPlayer.prototype.seekToLive = function () {
        var _this = this;
        this.setState({ currentTime: this.state.liveEdge }, function () {
            _this.progress({ currentTime: _this.state.currentTime, liveEdge: _this.state.liveEdge });
            _this.player && _this.player.seekToLive();
            _this.forcePlay();
            _this.props.onEvent && _this.props.onEvent({ 'type': PlayerEventTypes_1.default.SEEK_TO_LIVE });
        });
    };
    BCPlayer.prototype.toggleFS = function () {
        var _this = this;
        this.setState({ fullScreen: !this.state.fullScreen }, function () {
            if (_this.state.fullScreen) {
                var initialOrient = react_native_orientation_1.default.getInitialOrientation();
                var height = _this.state.onRotate ? react_native_1.Dimensions.get('window').height : react_native_1.Dimensions.get('window').width;
                _this.props.onFullScreen && _this.props.onFullScreen(_this.state.fullScreen);
                if (!_this.state.onRotate)
                    react_native_orientation_1.default.lockToLandscape();
                _this.animToFullscreen(height);
            }
            else {
                if (_this.props.fullScreenOnly) {
                    _this.setState({ paused: true }, function () { return _this.props.onPlay(!_this.state.paused); });
                }
                _this.props.onFullScreen && _this.props.onFullScreen(_this.state.fullScreen);
                if (!_this.state.onRotate)
                    react_native_orientation_1.default.lockToPortrait();
                _this.animToInline();
                setTimeout(function () {
                    if (!_this.props.lockPortraitOnFsExit)
                        react_native_orientation_1.default.unlockAllOrientations();
                }, 1500);
            }
            _this.setState({ onRotate: false });
        });
    };
    BCPlayer.prototype.animToFullscreen = function (height) {
        react_native_1.Animated.parallel([
            react_native_1.Animated.timing(this.animFullscreen, { toValue: height, duration: 200 }),
            react_native_1.Animated.timing(this.animInline, { toValue: height, duration: 200 })
        ]).start();
    };
    BCPlayer.prototype.animToInline = function (height) {
        var newHeight = height || this.state.inlineHeight;
        react_native_1.Animated.parallel([
            react_native_1.Animated.timing(this.animFullscreen, { toValue: newHeight, duration: 100 }),
            react_native_1.Animated.timing(this.animInline, { toValue: this.state.inlineHeight, duration: 100 })
        ]).start();
    };
    BCPlayer.prototype.setDuration = function (duration) {
        this.setState({ duration: duration.duration });
    };
    BCPlayer.prototype.toggleMute = function () {
        this.setState({
            muted: !this.state.muted,
            controlsOverlayClicked: true
        });
    };
    BCPlayer.prototype.seek = function (percent) {
        var currentTime = percent * this.state.duration;
        this.setState({
            seeking: true,
            currentTime: currentTime,
            controlsOverlayClicked: true
        });
    };
    BCPlayer.prototype.seekTo = function (seconds) {
        var percent = seconds / this.state.duration;
        if (seconds > this.state.duration) {
            // throw new Error(`Current time (${seconds}) exceeded the duration ${this.state.duration}`)
            return;
        }
        return this.onSeekRelease(percent);
    };
    BCPlayer.prototype.onSeekRelease = function (percent) {
        var _this = this;
        var seconds = this.state.duration > 0 ? percent * this.state.duration : percent * this.state.liveEdge;
        this.setState({ progress: percent, completed: false, seeking: false, currentTime: (this.state.liveEdge < 1) && (this.state.duration <= seconds) ? this.state.duration - .01 : seconds }, function () {
            _this.player && _this.player.seekTo((_this.state.liveEdge < 1) && (_this.state.duration <= seconds) ? _this.state.duration - 0.01 : seconds);
            _this.props.onEvent && _this.props.onEvent({ 'type': PlayerEventTypes_1.default.SEEK_TO, time: seconds });
            _this.forcePlay();
        });
    };
    BCPlayer.prototype.progress = function (time) {
        var currentTime = time.currentTime, duration = time.duration, isInLiveEdge = time.isInLiveEdge, liveEdge = time.liveEdge;
        var progress = currentTime / (duration > 0 ? duration : liveEdge);
        if (!this.state.seeking) {
            this.setState({ progress: progress, currentTime: currentTime, isInLiveEdge: isInLiveEdge, liveEdge: liveEdge });
        }
    };
    BCPlayer.prototype.toggleQualityOverlay = function () {
        this.setState({
            qualityControlMenu: !this.state.qualityControlMenu,
            controlsOverlayClicked: true
        });
    };
    BCPlayer.prototype.toggleQuality = function (value) {
        var _this = this;
        this.setState({
            qualityControlMenu: !this.state.qualityControlMenu,
            controlsOverlayClicked: true,
            bitRate: (value >= 0 && value !== null) ? quality[value] : this.state.bitRate,
            selectedQualityIndex: (value >= 0 && value !== null) ? value : this.state.selectedQualityIndex
        }, function () {
            _this.props.onEvent && _this.props.onEvent({ 'type': PlayerEventTypes_1.default.QUALITY_SELECTED, bitRate: qualityContent[value] });
        });
    };
    BCPlayer.prototype.togglePlay = function () {
        var _this = this;
        this.setState({
            paused: !this.state.paused,
            controlsOverlayClicked: true
        }, function () {
            _this.player && _this.player.playVideo(!_this.state.paused);
            if (_this.state.paused)
                _this.props.onEvent && _this.props.onEvent({ 'type': PlayerEventTypes_1.default.PAUSE });
        });
    };
    BCPlayer.prototype.forcePlay = function () {
        var _this = this;
        this.setState({
            paused: false,
            controlsOverlayClicked: true
        }, function () {
            _this.player && _this.player.playVideo(true);
        });
    };
    // openAirplay() {
    //     this.player && this.player.createAirplayIconOverlay();
    // }
    BCPlayer.prototype.forward = function () {
        var _this = this;
        this.setState({
            controlsOverlayClicked: true,
            currentTime: (Math.floor(this.state.currentTime) <= Math.floor(this.state.liveEdge) || Math.floor(this.state.currentTime) <= Math.floor(this.state.duration)) ? (this.state.currentTime + FORWARD_CONTROL) : this.state.currentTime
        }, function () {
            _this.player && _this.player.seekTo(_this.state.currentTime + FORWARD_CONTROL);
            _this.props.onEvent && _this.props.onEvent({ 'type': PlayerEventTypes_1.default.FORWARD });
        });
    };
    BCPlayer.prototype.rewind = function () {
        var _this = this;
        if (this.state.completed)
            this.forcePlay();
        this.setState({
            controlsOverlayClicked: true,
            currentTime: ((this.state.currentTime - FORWARD_CONTROL) >= 0) ? this.state.currentTime - FORWARD_CONTROL : this.state.currentTime,
            completed: false
        }, function () {
            if ((_this.state.currentTime - FORWARD_CONTROL) >= 0) {
                _this.player && _this.player.seekTo(_this.state.currentTime - FORWARD_CONTROL);
                _this.props.onEvent && _this.props.onEvent({ 'type': PlayerEventTypes_1.default.REWIND });
            }
        });
    };
    BCPlayer.prototype.onAnimEnd = function () {
        this.setState({ showClickOverlay: !this.state.showControls });
    };
    BCPlayer.prototype.replay = function () {
        var _this = this;
        this.player && this.player.seekTo(0);
        this.player && this.player.playVideo(true);
        this.setState({ currentTime: 0, paused: false, completed: false }, function () {
            _this.progress({ currentTime: _this.state.currentTime, duration: _this.state.duration });
            _this.props.onEvent && _this.props.onEvent({ 'type': PlayerEventTypes_1.default.REPLAY });
        });
    };
    BCPlayer.prototype.overlayClick = function () {
        this.setState({ showControls: false });
    };
    BCPlayer.prototype.render = function () {
        var _this = this;
        var theme = {
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
        var _a = this.state, fullScreen = _a.fullScreen, paused = _a.paused, bitRate = _a.bitRate, progress = _a.progress, duration = _a.duration, currentTime = _a.currentTime, qualityControlMenu = _a.qualityControlMenu, loading = _a.loading, showControls = _a.showControls, showClickOverlay = _a.showClickOverlay, selectedQualityIndex = _a.selectedQualityIndex, isInLiveEdge = _a.isInLiveEdge, muted = _a.muted, completed = _a.completed, liveEdge = _a.liveEdge;
        var style = this.props.style;
        var AnimView = showControls ? fade_anim_1.FadeInAnim : fade_anim_1.FadeOutAnim;
        return (<react_native_1.View>
                {loading && <react_native_1.View style={styles.loader}><react_native_1.View style={{ position: 'absolute', left: '45%', top: '43%', zIndex: 4000 }}><react_native_1.ActivityIndicator size="large" color="#fff"/></react_native_1.View></react_native_1.View>}
                <AnimView style={styles.topMenu} onEnd={this.onAnimEnd} onOverlayClick={function () { return _this.setState({ controlsOverlayClicked: !_this.state.controlsOverlayClicked }); }}>
                    <react_native_1.SafeAreaView style={styles.topSubMenu}>
                        <ToggleIcon_1.ToggleIcon onPress={function () { return _this.toggleFS(); }} iconOff="fullscreen" iconOn="fullscreen-exit" isOn={fullScreen} theme={theme.fullscreen} size={35}/>
                        <qualityControl_1.QualityControl theme={theme.qualityControl} toggleQuality={function () { return _this.toggleQualityOverlay(); }} paddingRight={10} selectedOption={selectedQualityIndex}/>
                    </react_native_1.SafeAreaView>
                    {qualityControlMenu &&
            <qualityOverlayButtons_1.QualityOverlayButtons onPress={function (value) { return _this.toggleQuality.bind(_this, value); }} qualityContent={qualityContent} selectedQualityIndex={selectedQualityIndex}/>}
                    <screenButtons_1.ScreenButtons togglePlay={this.togglePlay.bind(this)} forcePlay={this.forcePlay.bind(this)} loading={loading} paused={paused} forward={this.forward.bind(this)} rewind={this.rewind.bind(this)} theme={theme} paused={paused} completed={completed} replay={this.replay.bind(this)} onOverlayClick={function () { return _this.overlayClick.bind(_this); }} showForward={liveEdge > 0 ? (liveEdge - currentTime) > 10 : (duration - currentTime) > 10} showBackward={currentTime > 10}/>

                    {<react_native_1.View style={[styles.bottomBar, (react_native_1.Platform.OS === 'ios' && this.state.fullScreen) ? { bottom: 15 } : { bottom: 0 }]}>
                        <ControlBar_1.ControlBar onSeek={function (pos) { return _this.seek(pos); }} onSeekRelease={function (pos) { return _this.onSeekRelease(pos); }} progress={progress} currentTime={currentTime} theme={theme} duration={duration.duration || duration} isInLiveEdge={isInLiveEdge} seekToLive={function () { return _this.seekToLive(); }} liveEdge={liveEdge}/>
                    </react_native_1.View>}
                </AnimView>
                {showClickOverlay &&
            <react_native_1.TouchableOpacity style={styles.controlsVisibility} onPress={function () { return _this.setState({ showControls: true }); }}/>}
                <react_native_1.Animated.View style={[
            styles.background,
            fullScreen ?
                (styles.fullScreen, { height: this.animFullscreen })
                : { height: this.animInline },
            fullScreen ? null : style
        ]}>
                    <react_native_1.StatusBar hidden={fullScreen}/>
                    <BrightcovePlayerWithEvents ref={function (player) { return _this.player = player; }} {...this.props} style={[styles.player, this.props.style]} playerId={this.props.playerId ? this.props.playerId : "com.brightcove/react-native/" + react_native_1.Platform.OS} onBeforeEnterFullscreen={this.toggleFS.bind(this)} onBeforeExitFullscreen={this.toggleFS.bind(this)} disableDefaultControl={true} onChangeDuration={function (duration) { return _this.setDuration(duration); }} onProgress={function (e) { return _this.progress(e); }} volume={muted ? 0 : 10} bitRate={bitRate} onBufferingStarted={function () { return _this.setState({ loading: true }); }} onBufferingCompleted={function () { return _this.setState({ loading: false }); }} onEnd={function () { return _this.setState({ completed: true }); }} autoPlay={true}/>
                </react_native_1.Animated.View>
            </react_native_1.View>);
    };
    return BCPlayer;
}(react_1.Component));
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
