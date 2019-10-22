"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ReactNative = require("react-native");
class BrightcovePlayer extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            fullscreen: false
        };
        this.setNativeProps = (nativeProps) => {
            if (this._root) {
                this._root.setNativeProps(nativeProps);
            }
        };
        this.componentWillUnmount = react_native_1.Platform.select({
            ios: () => {
                react_native_1.NativeModules.BrightcovePlayerManager.dispose(ReactNative.findNodeHandle(this));
            },
            android: function () {
            }
        });
        this.setFullscreen = react_native_1.Platform.select({
            ios: (fullscreen) => {
                react_native_1.NativeModules.BrightcovePlayerManager.setFullscreen(ReactNative.findNodeHandle(this), fullscreen);
            },
            android: (fullscreen) => {
                react_native_1.UIManager.dispatchViewManagerCommand(ReactNative.findNodeHandle(this._root), react_native_1.UIManager.getViewManagerConfig('BrightcovePlayer').Commands.setFullscreen, [fullscreen]);
            }
        });
        // createAirplayIconOverlay
        this.createAirplayIconOverlay = react_native_1.Platform.select({
            ios: () => {
                react_native_1.NativeModules.BrightcovePlayerManager.createAirplayIconOverlay(ReactNative.findNodeHandle(this));
            }
        });
        this.setBitRate = react_native_1.Platform.select({
            ios: (prop) => {
                react_native_1.NativeModules.BrightcovePlayerManager.setBitRate(ReactNative.findNodeHandle(this), prop);
            },
            android: (prop) => {
                react_native_1.UIManager.dispatchViewManagerCommand(ReactNative.findNodeHandle(this._root), react_native_1.UIManager.getViewManagerConfig('BrightcovePlayer').Commands.setBitRate, [prop]);
            }
        });
        this.seekToLive = react_native_1.Platform.select({
            ios: () => {
                react_native_1.NativeModules.BrightcovePlayerManager.seekToLive(ReactNative.findNodeHandle(this));
            },
            android: (prop) => {
                react_native_1.UIManager.dispatchViewManagerCommand(ReactNative.findNodeHandle(this._root), react_native_1.UIManager.getViewManagerConfig('BrightcovePlayer').Commands.seekToLive, [prop]);
            }
        });
        this.playVideo = react_native_1.Platform.select({
            ios: (prop) => {
                react_native_1.NativeModules.BrightcovePlayerManager.playVideo(ReactNative.findNodeHandle(this), prop);
            },
            android: (prop) => {
                react_native_1.UIManager.dispatchViewManagerCommand(ReactNative.findNodeHandle(this._root), react_native_1.UIManager.getViewManagerConfig('BrightcovePlayer').Commands.playVideo, [prop]);
            }
        });
        this.seekTo = react_native_1.Platform.select({
            ios: (seconds) => {
                react_native_1.NativeModules.BrightcovePlayerManager.seekTo(ReactNative.findNodeHandle(this), seconds);
            },
            android: (seconds) => {
                react_native_1.UIManager.dispatchViewManagerCommand(ReactNative.findNodeHandle(this._root), react_native_1.UIManager.getViewManagerConfig('BrightcovePlayer').Commands.seekTo, [seconds]);
            }
        });
    }
    render() {
        return (React.createElement(NativeBrightcovePlayer, Object.assign({ ref: (e) => (this._root = e) }, this.props, { style: [
                this.props.style,
                this.state.fullscreen && {
                    position: 'absolute',
                    zIndex: 9999,
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                },
                this.state.fullscreen && this.props.fullscreenStyle
            ], onReady: (event) => this.props.onReady && this.props.onReady(event.nativeEvent), onMetadataLoaded: (event) => this.props.onMetadataLoaded && this.props.onMetadataLoaded(event.nativeEvent), onPlay: (event) => this.props.onPlay && this.props.onPlay(event.nativeEvent), onPause: (event) => this.props.onPause && this.props.onPause(event.nativeEvent), onEnd: (event) => this.props.onEnd && this.props.onEnd(event.nativeEvent), onProgress: (event) => this.props.onProgress && this.props.onProgress(event.nativeEvent), onChangeDuration: (event) => this.props.onChangeDuration &&
                this.props.onChangeDuration(event.nativeEvent), onUpdateBufferProgress: (event) => this.props.onUpdateBufferProgress &&
                this.props.onUpdateBufferProgress(event.nativeEvent), onBufferingStarted: (event) => this.props.onBufferingStarted &&
                this.props.onBufferingStarted(event.nativeEvent), onBufferingCompleted: (event) => this.props.onBufferingCompleted &&
                this.props.onBufferingCompleted(event.nativeEvent), onBeforeEnterFullscreen: (event) => {
                this.props.onBeforeEnterFullscreen &&
                    this.props.onBeforeEnterFullscreen(event.nativeEvent);
            }, onBeforeExitFullscreen: (event) => {
                this.props.onBeforeExitFullscreen &&
                    this.props.onBeforeExitFullscreen(event.nativeEvent);
            }, onEnterFullscreen: (event) => {
                this.props.onEnterFullscreen &&
                    this.props.onEnterFullscreen(event.nativeEvent);
                this.setState({ fullscreen: true });
            }, onExitFullscreen: (event) => {
                this.props.onExitFullscreen &&
                    this.props.onExitFullscreen(event.nativeEvent);
                this.setState({ fullscreen: false });
            }, onNetworkConnectivityChange: (event) => {
                this.props.onNetworkConnectivityChange && this.props.onNetworkConnectivityChange(event.nativeEvent);
            }, onError: (event) => {
                this.props.onError && this.props.onError(event.nativeEvent);
            } })));
    }
}
const NativeBrightcovePlayer = react_native_1.requireNativeComponent('BrightcovePlayer');
exports.default = BrightcovePlayer;
//# sourceMappingURL=BrightcovePlayer.js.map