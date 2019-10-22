"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_native_1 = require("react-native");
const backgroundColor = 'transparent';
const styles = react_native_1.StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor,
        justifyContent: 'center',
    }
});
class Time extends react_1.Component {
    getTime(time) {
        // format the seconds saved into 00:00:00
        const secs = time % 60;
        const s2 = (time - secs) / 60;
        const mins = s2 % 60;
        const hrs = (s2 - mins) / 60;
        const hours = this.addZeros(hrs) > 0 ? `${this.addZeros(hrs)}:` : '';
        return `${hours}${this.addZeros(mins)}:${this.addZeros(secs)}`;
    }
    addZeros(time) {
        return (time < 10) ? (`0${time}`) : time;
    }
    render() {
        return (React.createElement(react_native_1.View, { style: styles.container },
            React.createElement(react_native_1.Text, { style: { color: this.props.theme } }, this.props.time > 0 ? this.getTime(parseInt(this.props.time, 10)) : '')));
    }
}
exports.Time = Time;
Time.defaultProps = {
    time: 0,
    theme: '#fff'
};
//# sourceMappingURL=Time.js.map