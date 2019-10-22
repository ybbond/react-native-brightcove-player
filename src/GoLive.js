"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_native_1 = require("react-native");
const styles = react_native_1.StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row'
    },
    goLiveBorderDesign: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#9b9b9b'
    },
    goLiveTextDesign: {
        color: '#9b9b9b',
        fontSize: 10,
        textAlign: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8
    },
    enableGoLive: {
        borderRadius: 5,
        backgroundColor: 'green'
    }
});
class GoLive extends react_1.Component {
    render() {
        return (React.createElement(react_native_1.TouchableOpacity, { style: [!this.props.disabled ? styles.enableGoLive : styles.goLiveBorderDesign], onPress: () => this.props.seekToLive() },
            React.createElement(react_native_1.Text, { style: [styles.goLiveTextDesign, !this.props.disabled && { color: '#fff' }] }, "Go Live")));
    }
}
exports.GoLive = GoLive;
//# sourceMappingURL=GoLive.js.map