"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const MaterialIcons_1 = require("react-native-vector-icons/MaterialIcons");
const backgroundColor = 'transparent';
const styles = react_native_1.StyleSheet.create({
    btnContainer: {
        alignItems: 'center',
        backgroundColor,
        justifyContent: 'center',
        zIndex: 101
    }
});
const ToggleIcon = (props) => {
    const { paddingLeft, paddingRight, isOn, iconOn, iconOff, theme, size } = props;
    const padding = {
        paddingLeft: paddingLeft ? 10 : 0,
        paddingRight: paddingRight ? 5 : 0
    };
    return (React.createElement(react_native_1.View, { style: styles.btnContainer },
        React.createElement(react_native_1.TouchableOpacity, { onPress: () => props.onPress() },
            React.createElement(MaterialIcons_1.default, { style: padding, name: isOn ? iconOn : iconOff, color: theme, size: size }))));
};
exports.ToggleIcon = ToggleIcon;
ToggleIcon.defaultProps = {
    onPress: undefined,
    isOn: false,
    size: 25,
    paddingRight: false,
    paddingLeft: false
};
//# sourceMappingURL=ToggleIcon.js.map