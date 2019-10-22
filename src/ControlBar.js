"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const Time_1 = require("./Time");
const Scrubber_1 = require("./Scrubber");
const GoLive_1 = require("./GoLive");
const styles = react_native_1.StyleSheet.create({
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
const ControlBar = (props) => {
    const { onSeek, onSeekRelease, progress, currentTime, theme, isInLiveEdge, liveEdge, duration } = props;
    return (React.createElement(react_native_1.View, { style: styles.controlBarContainer },
        React.createElement(react_native_1.View, { style: styles.timerSpace },
            React.createElement(Time_1.Time, { time: currentTime, theme: theme.seconds }),
            duration <= 0 && liveEdge && liveEdge > 0 ? React.createElement(GoLive_1.GoLive, { disabled: isInLiveEdge, seekToLive: () => props.seekToLive() }) : null),
        React.createElement(Scrubber_1.Scrubber, { onSeek: (pos) => onSeek(pos), onSeekRelease: (pos) => onSeekRelease(pos), progress: progress, theme: { scrubberThumb: theme.scrubberThumb, scrubberBar: theme.scrubberBar } })));
};
exports.ControlBar = ControlBar;
//# sourceMappingURL=ControlBar.js.map