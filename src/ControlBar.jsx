"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var prop_types_1 = require("prop-types");
var react_native_1 = require("react-native");
var Time_1 = require("./Time");
var Scrubber_1 = require("./Scrubber");
var GoLive_1 = require("./GoLive");
var styles = react_native_1.StyleSheet.create({
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
});
var ControlBar = function (props) {
    var onSeek = props.onSeek, onSeekRelease = props.onSeekRelease, progress = props.progress, currentTime = props.currentTime, theme = props.theme, isInLiveEdge = props.isInLiveEdge, liveEdge = props.liveEdge, duration = props.duration;
    return (<react_native_1.View style={styles.controlBarContainer}>
            <react_native_1.View style={styles.timerSpace}>
                <Time_1.Time time={currentTime} theme={theme.seconds}/>
                {duration <= 0 && liveEdge > 0 && <GoLive_1.GoLive theme={theme.seconds} disabled={isInLiveEdge} seekToLive={function () { return props.seekToLive(); }}/>}
            </react_native_1.View>
            <Scrubber_1.Scrubber onSeek={function (pos) { return onSeek(pos); }} onSeekRelease={function (pos) { return onSeekRelease(pos); }} progress={progress} theme={{ scrubberThumb: theme.scrubberThumb, scrubberBar: theme.scrubberBar }} fullScreen={props.fullScreen}/>
        </react_native_1.View>);
};
exports.ControlBar = ControlBar;
ControlBar.propTypes = {
    onSeek: prop_types_1.default.func.isRequired,
    onSeekRelease: prop_types_1.default.func.isRequired,
    progress: prop_types_1.default.number.isRequired,
    currentTime: prop_types_1.default.number.isRequired,
    duration: prop_types_1.default.number.isRequired,
    theme: prop_types_1.default.object.isRequired,
    seekToLive: prop_types_1.default.func.isRequired
};
