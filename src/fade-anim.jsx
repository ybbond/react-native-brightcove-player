"use strict";
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
exports.FadeInAnim = function (props) {
    var fadeAnim = react_1.useState(new react_native_1.Animated.Value(0))[0]; // Initial value for opacity: 0
    react_1.default.useEffect(function () {
        react_native_1.Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start(props.onEnd);
    }, []);
    return (<react_native_1.Animated.View // Special animatable View
     style={__assign({}, props.style, { opacity: fadeAnim })}>
            <react_native_1.TouchableOpacity onPress={props.onOverlayClick} style={props.style // Bind opacity to animated value
    }>
                {props.children}
            </react_native_1.TouchableOpacity>
        </react_native_1.Animated.View>);
};
exports.FadeOutAnim = function (props) {
    var fadeAnim = react_1.useState(new react_native_1.Animated.Value(1))[0]; // Initial value for opacity: 0
    react_1.default.useEffect(function () {
        react_native_1.Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start(props.onEnd);
    }, []);
    return (<react_native_1.Animated.View // Special animatable View
     style={__assign({}, props.style, { opacity: fadeAnim })}>
            {props.children}
        </react_native_1.Animated.View>);
};
