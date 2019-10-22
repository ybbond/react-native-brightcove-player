"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var prop_types_1 = require("prop-types");
var react_native_1 = require("react-native");
var styles = react_native_1.StyleSheet.create({
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
var GoLive = /** @class */ (function (_super) {
    __extends(GoLive, _super);
    function GoLive() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GoLive.prototype.render = function () {
        var _this = this;
        return (<react_native_1.TouchableOpacity style={[!this.props.disabled ? styles.enableGoLive : styles.goLiveBorderDesign]} onPress={function () { return _this.props.seekToLive(); }}>
                <react_native_1.Text style={[styles.goLiveTextDesign, !this.props.disabled && { color: '#fff' }]}>Go Live</react_native_1.Text>
            </react_native_1.TouchableOpacity>);
    };
    return GoLive;
}(react_1.Component));
exports.GoLive = GoLive;
GoLive.propTypes = {
    theme: prop_types_1.default.string.isRequired,
    seekToLive: prop_types_1.default.func.isRequired,
};
