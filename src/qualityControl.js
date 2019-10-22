"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const PropTypes = require("prop-types");
const react_native_1 = require("react-native");
const settings = require('../Resources/settings_icon.png');
const backgroundColor = 'transparent';
const styles = react_native_1.StyleSheet.create({
    btnContainer: {
        alignItems: 'center',
        backgroundColor,
        justifyContent: 'center',
        zIndex: 101
    },
    textStyle: {
        backgroundColor: '#ff5000',
        color: 'white',
        position: 'absolute',
        zIndex: 102,
        borderRadius: 2,
        left: 15,
        paddingHorizontal: 2,
        paddingBottom: 1
    }
});
const QualityControl = (props) => {
    const { paddingLeft, paddingRight, } = props;
    const padding = {
        height: 23,
        paddingLeft: paddingLeft ? paddingLeft : 0,
        paddingRight: paddingRight ? paddingRight : 0,
        width: 23,
        marginRight: 17
    };
    const contolArray = ['Auto', 'High', 'Med', 'Data'];
    return (React.createElement(react_native_1.View, { style: styles.btnContainer },
        React.createElement(react_native_1.TouchableOpacity, { onPress: () => props.toggleQuality() },
            React.createElement(react_native_1.View, { style: styles.textStyle },
                React.createElement(react_native_1.Text, { style: { color: 'white', fontSize: 9 } }, contolArray[props.selectedOption])),
            React.createElement(react_native_1.Image, { style: padding, source: settings }))));
};
exports.QualityControl = QualityControl;
QualityControl.propTypes = {
    onPress: PropTypes.func,
    theme: PropTypes.string.isRequired,
    size: PropTypes.number,
    paddingRight: PropTypes.bool,
    paddingLeft: PropTypes.bool
};
QualityControl.defaultProps = {
    onPress: undefined,
    isOn: false,
    size: 25,
    paddingRight: false,
    paddingLeft: false
};
//# sourceMappingURL=qualityControl.js.map