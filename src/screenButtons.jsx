"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var prop_types_1 = require("prop-types");
var react_native_1 = require("react-native");
var MaterialIcons_1 = require("react-native-vector-icons/MaterialIcons");
var FontAwesome_1 = require("react-native-vector-icons/FontAwesome");
var styles = react_native_1.StyleSheet.create({
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
var ScreenButtons = function (props) {
    var onPress = function () {
        if (props.completed) {
            props.replay();
            props.forcePlay();
        }
        else {
            props.togglePlay();
        }
    };
    return (<react_native_1.TouchableOpacity style={styles.btnContainer} onPress={props.onOverlayClick()}>
        <react_native_1.View style={[styles.individualButton, styles.rewindButton]}>
            <react_native_1.TouchableOpacity onPress={function () { return props.showBackward && props.rewind(); }}>
                <react_native_1.View style={styles.buttonContainer}>
                    <react_native_1.View style={styles.buttonContentIcon}>
                        <FontAwesome_1.default name={'angle-double-left'} color={props.showBackward ? props.theme.screenButtons : 'grey'} size={36}/>
                    </react_native_1.View><react_native_1.Text style={[styles.buttonContentTxt, props.showBackward ? styles.colorWhite : styles.colorGrey]}>10</react_native_1.Text>
                </react_native_1.View>
            </react_native_1.TouchableOpacity>
        </react_native_1.View>
        <react_native_1.View style={[styles.individualButton, styles.centerButton]}>

            {!props.loading && <react_native_1.TouchableOpacity onPress={function () { return onPress(); }}><MaterialIcons_1.default name={props.completed ? 'replay' : props.paused ? 'play-arrow' : 'pause'} color={props.theme.screenButtons} size={props.completed ? 28 : 36}/></react_native_1.TouchableOpacity>}
        </react_native_1.View>
        <react_native_1.View style={[styles.individualButton, styles.forwardButton]}>
            <react_native_1.TouchableOpacity onPress={function () { return props.showForward && props.forward(); }}>
                <react_native_1.View style={styles.buttonContainer}>
                    <react_native_1.Text style={[styles.buttonContentTxt, props.showForward ? styles.colorWhite : styles.colorGrey]}>10</react_native_1.Text>
                    <react_native_1.View style={styles.buttonContentIcon}>
                        <FontAwesome_1.default name={'angle-double-right'} color={props.showForward ? props.theme.screenButtons : 'grey'} size={36}/>
                    </react_native_1.View>
                </react_native_1.View>
            </react_native_1.TouchableOpacity>
        </react_native_1.View>

    </react_native_1.TouchableOpacity>);
};
exports.ScreenButtons = ScreenButtons;
ScreenButtons.propTypes = {
    onPress: prop_types_1.default.func,
    theme: prop_types_1.default.object.isRequired
};
ScreenButtons.defaultProps = {
    onPress: undefined,
    theme: {
        screenButtons: '#fff'
    }
};
