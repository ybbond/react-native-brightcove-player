import * as React from 'react'
import { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

const backgroundColor = 'transparent'

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor,
        justifyContent: 'center',
    }
})
interface TimeProps {
    theme: string
    time: string | number
}

class Time extends Component<TimeProps, {}> {
    static defaultProps : {
        theme: string
        time: number
    }
    getTime(time: number) {
        // format the seconds saved into 00:00:00
        const secs = time % 60
        const s2 = (time - secs) / 60
        const mins = s2 % 60
        const hrs = (s2 - mins) / 60
        const hours = this.addZeros(hrs) > 0 ? `${this.addZeros(hrs)}:` : ''
        return `${hours}${this.addZeros(mins)}:${this.addZeros(secs)}`
    }

    addZeros(time: number) {
        return (time < 10) ? (`0${time}`) : time
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{ color: this.props.theme }}>{this.props.time > 0? this.getTime(parseInt(this.props.time as string, 10)) : ''}</Text>
            </View>
        )
    }
}

Time.defaultProps = {
    time: 0,
    theme: '#fff'
}

export { Time }
