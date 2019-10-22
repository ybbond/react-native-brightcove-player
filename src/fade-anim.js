"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const React = require("react");
const react_native_1 = require("react-native");
exports.FadeInAnim = (props) => {
    const [fadeAnim] = react_1.useState(new react_native_1.Animated.Value(0)); // Initial value for opacity: 0
    React.useEffect(() => {
        react_native_1.Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start(props.onEnd);
    }, []);
    return (React.createElement(react_native_1.Animated.View // Special animatable View
    , { style: Object.assign(Object.assign({}, props.style), { opacity: fadeAnim }) },
        React.createElement(react_native_1.TouchableOpacity, { onPress: props.onOverlayClick, style: props.style // Bind opacity to animated value
         }, props.children)));
};
exports.FadeOutAnim = (props) => {
    const [fadeAnim] = react_1.useState(new react_native_1.Animated.Value(1)); // Initial value for opacity: 0
    React.useEffect(() => {
        react_native_1.Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start(props.onEnd);
    }, []);
    return (React.createElement(react_native_1.Animated.View // Special animatable View
    , { style: Object.assign(Object.assign({}, props.style), { opacity: fadeAnim }) }, props.children));
};
//# sourceMappingURL=fade-anim.js.map