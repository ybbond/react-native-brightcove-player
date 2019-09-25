import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Icons from 'react-native-vector-icons/MaterialIcons'

const backgroundColor = 'transparent'

const styles = StyleSheet.create({
    btnContainer: {
        alignItems: 'center',
        backgroundColor,
        justifyContent: 'center'
    }
})

const QualityControl = (props) => {
    const {
        paddingLeft,
        paddingRight,
        isOn,
        iconOn,
        iconOff,
        theme,
        size
    } = props

    const padding = {
        paddingLeft: paddingLeft ? 10 : 0,
        paddingRight: paddingRight ? 5 : 0
    }

    return (
        <View style={styles.btnContainer}>
            <TouchableOpacity
                onPress={() => props.toggleQuality()}
            >
                <Icons
                    style={padding}
                    name={"high-quality"}
                    color={theme}
                    size={size}
                />
            </TouchableOpacity>
        </View>
    )
}

QualityControl.propTypes = {
    onPress: PropTypes.func,
    isOn: PropTypes.bool,
    iconOff: PropTypes.string.isRequired,
    iconOn: PropTypes.string.isRequired,
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
