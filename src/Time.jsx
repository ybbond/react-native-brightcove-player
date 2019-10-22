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
var backgroundColor = 'transparent';
var styles = react_native_1.StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: backgroundColor,
        justifyContent: 'center',
    }
});
var Time = /** @class */ (function (_super) {
    __extends(Time, _super);
    function Time() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Time.prototype.getTime = function (time) {
        // format the seconds saved into 00:00:00
        var secs = time % 60;
        var s2 = (time - secs) / 60;
        var mins = s2 % 60;
        var hrs = (s2 - mins) / 60;
        var hours = this.addZeros(hrs) > 0 ? this.addZeros(hrs) + ":" : '';
        return "" + hours + this.addZeros(mins) + ":" + this.addZeros(secs);
    };
    Time.prototype.addZeros = function (time) {
        return (time < 10) ? ("0" + time) : time;
    };
    Time.prototype.render = function () {
        return (<react_native_1.View style={styles.container}>
                <react_native_1.Text style={{ color: this.props.theme }}>{this.props.time > 0 ? this.getTime(parseInt(this.props.time, 10)) : ''}</react_native_1.Text>
            </react_native_1.View>);
    };
    return Time;
}(react_1.Component));
exports.Time = Time;
Time.propTypes = {
    time: prop_types_1.default.number.isRequired,
    theme: prop_types_1.default.string.isRequired
};
