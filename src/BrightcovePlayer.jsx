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
var prop_types_1 = require("prop-types");
var react_1 = require("react");
var react_native_1 = require("react-native");
var BrightcovePlayer = /** @class */ (function (_super) {
    __extends(BrightcovePlayer, _super);
    function BrightcovePlayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            fullscreen: false
        };
        _this.setNativeProps = function (nativeProps) {
            if (_this._root) {
                _this._root.setNativeProps(nativeProps);
            }
        };
        _this.componentWillUnmount = react_native_1.Platform.select({
            ios: function () {
                react_native_1.NativeModules.BrightcovePlayerManager.dispose(react_native_1.default.findNodeHandle(this));
            },
            android: function () { }
        });
        return _this;
    }
    BrightcovePlayer.prototype.render = function () {
        var _this = this;
        return (<NativeBrightcovePlayer ref={function (e) { return (_this._root = e); }} {...this.props} style={[
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
        ]} onReady={function (event) {
            return _this.props.onReady && _this.props.onReady(event.nativeEvent);
        }} onMetadataLoaded={function (event) {
            return _this.props.onMetadataLoaded && _this.props.onMetadataLoaded(event.nativeEvent);
        }} onPlay={function (event) {
            return _this.props.onPlay && _this.props.onPlay(event.nativeEvent);
        }} onPause={function (event) {
            return _this.props.onPause && _this.props.onPause(event.nativeEvent);
        }} onEnd={function (event) { return _this.props.onEnd && _this.props.onEnd(event.nativeEvent); }} onProgress={function (event) {
            return _this.props.onProgress && _this.props.onProgress(event.nativeEvent);
        }} onChangeDuration={function (event) {
            return _this.props.onChangeDuration &&
                _this.props.onChangeDuration(event.nativeEvent);
        }} onUpdateBufferProgress={function (event) {
            return _this.props.onUpdateBufferProgress &&
                _this.props.onUpdateBufferProgress(event.nativeEvent);
        }} onBufferingStarted={function (event) {
            return _this.props.onBufferingStarted &&
                _this.props.onBufferingStarted(event.nativeEvent);
        }} onBufferingCompleted={function (event) {
            return _this.props.onBufferingCompleted &&
                _this.props.onBufferingCompleted(event.nativeEvent);
        }} onBeforeEnterFullscreen={function (event) {
            _this.props.onBeforeEnterFullscreen &&
                _this.props.onBeforeEnterFullscreen(event.nativeEvent);
        }} onBeforeExitFullscreen={function (event) {
            _this.props.onBeforeExitFullscreen &&
                _this.props.onBeforeExitFullscreen(event.nativeEvent);
        }} onEnterFullscreen={function (event) {
            _this.props.onEnterFullscreen &&
                _this.props.onEnterFullscreen(event.nativeEvent);
            _this.setState({ fullscreen: true });
        }} onExitFullscreen={function (event) {
            _this.props.onExitFullscreen &&
                _this.props.onExitFullscreen(event.nativeEvent);
            _this.setState({ fullscreen: false });
        }} onNetworkConnectivityChange={function (event) {
            _this.props.onNetworkConnectivityChange && _this.props.onNetworkConnectivityChange(event.nativeEvent);
        }} onError={function (event) {
            _this.props.onError && _this.props.onError(event.nativeEvent);
        }}/>);
    };
    return BrightcovePlayer;
}(react_1.Component));
// createAirplayIconOverlay
BrightcovePlayer.prototype.createAirplayIconOverlay = react_native_1.Platform.select({
    ios: function (prop) {
        console.log('reached');
        react_native_1.NativeModules.BrightcovePlayerManager.createAirplayIconOverlay(react_native_1.default.findNodeHandle(this));
    }
});
BrightcovePlayer.prototype.setBitRate = react_native_1.Platform.select({
    ios: function (prop) {
        react_native_1.NativeModules.BrightcovePlayerManager.setBitRate(react_native_1.default.findNodeHandle(this), prop);
    },
    android: function (prop) {
        react_native_1.UIManager.dispatchViewManagerCommand(react_native_1.default.findNodeHandle(this._root), react_native_1.UIManager.getViewManagerConfig('BrightcovePlayer').Commands.setBitRate, [prop]);
    }
});
BrightcovePlayer.prototype.seekToLive = react_native_1.Platform.select({
    ios: function (prop) {
        react_native_1.NativeModules.BrightcovePlayerManager.seekToLive(react_native_1.default.findNodeHandle(this));
    },
    android: function (prop) {
        react_native_1.UIManager.dispatchViewManagerCommand(react_native_1.default.findNodeHandle(this._root), react_native_1.UIManager.getViewManagerConfig('BrightcovePlayer').Commands.seekToLive, [prop]);
    }
});
BrightcovePlayer.prototype.playVideo = react_native_1.Platform.select({
    ios: function (prop) {
        react_native_1.NativeModules.BrightcovePlayerManager.playVideo(react_native_1.default.findNodeHandle(this), prop);
    },
    android: function (prop) {
        react_native_1.UIManager.dispatchViewManagerCommand(react_native_1.default.findNodeHandle(this._root), react_native_1.UIManager.getViewManagerConfig('BrightcovePlayer').Commands.playVideo, [prop]);
    }
});
BrightcovePlayer.prototype.seekTo = react_native_1.Platform.select({
    ios: function (seconds) {
        react_native_1.NativeModules.BrightcovePlayerManager.seekTo(react_native_1.default.findNodeHandle(this), seconds);
    },
    android: function (seconds) {
        react_native_1.UIManager.dispatchViewManagerCommand(react_native_1.default.findNodeHandle(this._root), react_native_1.UIManager.getViewManagerConfig('BrightcovePlayer').Commands.seekTo, [seconds]);
    }
});
BrightcovePlayer.prototype.setFullscreen = react_native_1.Platform.select({
    ios: function (fullscreen) {
        react_native_1.NativeModules.BrightcovePlayerManager.setFullscreen(react_native_1.default.findNodeHandle(this), fullscreen);
    },
    android: function (fullscreen) {
        react_native_1.UIManager.dispatchViewManagerCommand(react_native_1.default.findNodeHandle(this._root), react_native_1.UIManager.getViewManagerConfig('BrightcovePlayer').Commands.setFullscreen, [fullscreen]);
    }
});
BrightcovePlayer.propTypes = __assign({}, (react_native_1.ViewPropTypes || react_native_1.View.propTypes), { policyKey: prop_types_1.default.string, accountId: prop_types_1.default.string, playerId: prop_types_1.default.string, referenceId: prop_types_1.default.string, videoId: prop_types_1.default.string, videoToken: prop_types_1.default.string, autoPlay: prop_types_1.default.bool, play: prop_types_1.default.bool, fullscreen: prop_types_1.default.bool, fullscreenStyle: prop_types_1.default.object, disableDefaultControl: prop_types_1.default.bool, playerType: prop_types_1.default.string, volume: prop_types_1.default.number, bitRate: prop_types_1.default.number, playbackRate: prop_types_1.default.number, onReady: prop_types_1.default.func, onMetadataLoaded: prop_types_1.default.func, onPlay: prop_types_1.default.func, onPause: prop_types_1.default.func, onEnd: prop_types_1.default.func, onProgress: prop_types_1.default.func, onChangeDuration: prop_types_1.default.func, onUpdateBufferProgress: prop_types_1.default.func, onBufferingStarted: prop_types_1.default.func, onBufferingCompleted: prop_types_1.default.func, onBeforeEnterFullscreen: prop_types_1.default.func, onBeforeExitFullscreen: prop_types_1.default.func, onEnterFullscreen: prop_types_1.default.func, onExitFullscreen: prop_types_1.default.func, onError: prop_types_1.default.func, onNetworkConnectivityChange: prop_types_1.default.func });
BrightcovePlayer.defaultProps = {};
var NativeBrightcovePlayer = react_native_1.requireNativeComponent('BrightcovePlayer', BrightcovePlayer);
exports.default = BrightcovePlayer;
