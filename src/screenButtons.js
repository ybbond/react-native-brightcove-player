"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const PropTypes = require("prop-types");
const react_native_1 = require("react-native");
const MaterialIcons_1 = require("react-native-vector-icons/MaterialIcons");
const FontAwesome_1 = require("react-native-vector-icons/FontAwesome");
const styles = react_native_1.StyleSheet.create({
    btnContainer: {
        color: 'red',
        zIndex: 1,
        position: 'absolute',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        alignContent: 'stretch'
    },
    individualButton: {
        display: 'flex',
        flex: 1,
        flexBasis: 40
    },
    centerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rewindButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    forwardButton: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonContentTxt: {
        display: 'flex',
        fontWeight: 'bold',
        fontSize: 14,
        paddingTop: 3
    },
    buttonContentIcon: {
        display: 'flex'
    },
    colorGrey: {
        color: 'grey',
    },
    colorWhite: {
        color: 'white'
    }
});
const ScreenButtons = (props) => {
    const onPress = () => {
        if (props.completed) {
            props.replay();
            props.forcePlay();
        }
        else {
            props.togglePlay();
        }
    };
    return (React.createElement(react_native_1.TouchableOpacity, { style: styles.btnContainer, onPress: () => props.onOverlayClick() },
        React.createElement(react_native_1.View, { style: [styles.individualButton, styles.rewindButton] },
            React.createElement(react_native_1.TouchableOpacity, { onPress: () => props.showBackward && props.rewind() },
                React.createElement(react_native_1.View, { style: styles.buttonContainer },
                    React.createElement(react_native_1.View, { style: styles.buttonContentIcon },
                        React.createElement(FontAwesome_1.default, { name: 'angle-double-left', color: props.showBackward ? props.theme.screenButtons : 'grey', size: 36 })),
                    React.createElement(react_native_1.Text, { style: [styles.buttonContentTxt, props.showBackward ? styles.colorWhite : styles.colorGrey] }, "10")))),
        React.createElement(react_native_1.View, { style: [styles.individualButton, styles.centerButton] }, !props.loading && React.createElement(react_native_1.TouchableOpacity, { onPress: () => onPress() },
            React.createElement(MaterialIcons_1.default, { name: props.completed ? 'replay' : props.paused ? 'play-arrow' : 'pause', color: props.theme.screenButtons, size: props.completed ? 28 : 36 }))),
        React.createElement(react_native_1.View, { style: [styles.individualButton, styles.forwardButton] },
            React.createElement(react_native_1.TouchableOpacity, { onPress: () => props.showForward && props.forward() },
                React.createElement(react_native_1.View, { style: styles.buttonContainer },
                    React.createElement(react_native_1.Text, { style: [styles.buttonContentTxt, props.showForward ? styles.colorWhite : styles.colorGrey] }, "10"),
                    React.createElement(react_native_1.View, { style: styles.buttonContentIcon },
                        React.createElement(FontAwesome_1.default, { name: 'angle-double-right', color: props.showForward ? props.theme.screenButtons : 'grey', size: 36 })))))));
};
exports.ScreenButtons = ScreenButtons;
ScreenButtons.propTypes = {
    onPress: PropTypes.func,
    theme: PropTypes.object.isRequired
};
ScreenButtons.defaultProps = {
    onPress: undefined,
    theme: {
        screenButtons: '#fff'
    }
};
//# sourceMappingURL=screenButtons.js.map