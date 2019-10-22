"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var prop_types_1 = require("prop-types");
var react_native_1 = require("react-native");
var styles = react_native_1.StyleSheet.create({
    ovlySafeContainer: {
        zIndex: 3000,
        position: 'absolute',
        width: '100%',
        height: '85%',
    },
    ovlyContainer: {
        zIndex: 3000,
        width: '100%',
        height: '85%',
    },
    individualButton: {
        height: 30,
        paddingTop: 5
    },
    borderAttribute: {
        borderBottomWidth: 1,
        borderColor: '#e8e8e8',
        width: '100%'
    },
    btnContainer: {
        zIndex: 3000,
        position: 'absolute',
        top: 10,
        right: 78,
        borderWidth: 1,
        borderColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    arrowIcon: {
        zIndex: 1000,
        width: 8,
        height: 8,
        right: 76,
        top: 15,
        backgroundColor: 'white',
        position: 'absolute',
        transform: [{ rotate: '45deg' }]
    }
});
var QualityOverlayButtons = function (props) { return (<react_native_1.SafeAreaView style={styles.ovlySafeContainer}><react_native_1.TouchableOpacity style={styles.ovlyContainer} onPress={props.onPress(null)}>
    <react_native_1.View style={styles.arrowIcon}>
    </react_native_1.View>

    <react_native_1.View style={styles.btnContainer}>
        {props.qualityContent.map(function (data, index) { return <react_native_1.TouchableOpacity onPress={props.onPress(index)} key={index}>
                <react_native_1.View style={[{ flex: 1 }, !(props.qualityContent.length - 1 === index) ? styles.borderAttribute : null]}>
                    <react_native_1.Text style={[styles.individualButton, { color: props.selectedQualityIndex === index ? '#ff5000' : '#9b9b9b' }]}>{data}</react_native_1.Text></react_native_1.View></react_native_1.TouchableOpacity>; })}
    </react_native_1.View>
</react_native_1.TouchableOpacity></react_native_1.SafeAreaView>); };
exports.QualityOverlayButtons = QualityOverlayButtons;
QualityOverlayButtons.propTypes = {
    onPress: prop_types_1.default.func,
    qualityContent: prop_types_1.default.array
};
QualityOverlayButtons.defaultProps = {
    onPress: undefined
};
