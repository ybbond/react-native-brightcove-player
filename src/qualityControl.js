import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native'
import Icons from 'react-native-vector-icons/MaterialIcons'
const settings = require('../Resources/settings_icon.png')

const backgroundColor = 'transparent'

const styles = StyleSheet.create({
    btnContainer: {
        alignItems: 'center',
        backgroundColor,
        justifyContent: 'center',
        zIndex: 101
    }
})

const QualityControl = (props) => {
    const {
        paddingLeft,
        paddingRight,
        theme,
        size
    } = props

    const padding = {
        height: 18,
        paddingLeft: paddingLeft ? paddingLeft : 0,
        paddingRight: paddingRight ? paddingRight : 0,
        width: 18,
        marginRight:17
    }
    const contolArray = ['Auto', 'High', 'Medm', 'Data']
    return (
        <View style={styles.btnContainer}>

            <TouchableOpacity
                onPress={() => props.toggleQuality()}
            >
                <Text style={{backgroundColor: '#ff5000', color: 'white', fontSize: 8, position: 'absolute', zIndex: 102, borderRadius:2, left: 8}}>{contolArray[props.selectedOption]}</Text>
                <Image
                    style={padding}
                    source={settings}
                />
            </TouchableOpacity>
        </View>
    )
}

QualityControl.propTypes = {
    onPress: PropTypes.func,
    theme: PropTypes.string.isRequired,
    size: PropTypes.number,
    paddingRight: PropTypes.bool,
    paddingLeft: PropTypes.bool
}

QualityControl.defaultProps = {
    onPress: undefined,
    isOn: false,
    size: 25,
    paddingRight: false,
    paddingLeft: false
}

export { QualityControl }
