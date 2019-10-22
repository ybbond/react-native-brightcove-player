"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var prop_types_1 = require("prop-types");
var react_native_1 = require("react-native");
var settings = require('../Resources/settings_icon.png');
var backgroundColor = 'transparent';
var styles = react_native_1.StyleSheet.create({
    btnContainer: {
        alignItems: 'center',
        backgroundColor: backgroundColor,
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
var QualityControl = function (props) {
    var paddingLeft = props.paddingLeft, paddingRight = props.paddingRight, theme = props.theme, size = props.size;
    var padding = {
        height: 23,
        paddingLeft: paddingLeft ? paddingLeft : 0,
        paddingRight: paddingRight ? paddingRight : 0,
        width: 23,
        marginRight: 17
    };
    var contolArray = ['Auto', 'High', 'Med', 'Data'];
    return (<react_native_1.View style={styles.btnContainer}>

            <react_native_1.TouchableOpacity onPress={function () { return props.toggleQuality(); }}>
                <react_native_1.View style={styles.textStyle}><react_native_1.Text style={{ color: 'white', fontSize: 9 }}>{contolArray[props.selectedOption]}</react_native_1.Text></react_native_1.View>
                <react_native_1.Image style={padding} source={settings}/>
            </react_native_1.TouchableOpacity>
        </react_native_1.View>);
};
exports.QualityControl = QualityControl;
QualityControl.propTypes = {
    onPress: prop_types_1.default.func,
    theme: prop_types_1.default.string.isRequired,
    size: prop_types_1.default.number,
    paddingRight: prop_types_1.default.bool,
    paddingLeft: prop_types_1.default.bool
};
QualityControl.defaultProps = {
    onPress: undefined,
    isOn: false,
    size: 25,
    paddingRight: false,
    paddingLeft: false
};
