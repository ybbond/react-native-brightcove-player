"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const slider_1 = require("@react-native-community/slider");
const ThumbTracker = require('../Resources/controller.png');
const styles = react_native_1.StyleSheet.create({
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
        marginBottom: 0
    }
});
const Scrubber = (props) => {
    const trackColor = 'rgba(255,255,255,0.5)';
    const { progress, theme, onSeek, onSeekRelease } = props;
    return (React.createElement(react_native_1.View, { style: styles.container }, react_native_1.Platform.OS === 'ios' ?
        React.createElement(slider_1.default, { onValueChange: val => onSeek(val), onSlidingComplete: val => onSeekRelease(val), value: progress === Number.POSITIVE_INFINITY ? 0 : progress, minimumTrackTintColor: theme.scrubberBar, maximumTrackTintColor: trackColor, thumbImage: ThumbTracker })
        :
            React.createElement(react_native_1.Slider, { style: styles.slider, onValueChange: val => onSeek(val), onSlidingComplete: val => onSeekRelease(val), value: progress, thumbTintColor: "#e8e8e8", minimumTrackTintColor: theme.scrubberBar, maximumTrackTintColor: trackColor })));
};
exports.Scrubber = Scrubber;
//# sourceMappingURL=Scrubber.js.map