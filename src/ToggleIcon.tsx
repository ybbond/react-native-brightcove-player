import * as React from 'react'
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
interface ToggleIconProps {
    paddingLeft: number
    paddingRight: number
    isOn: boolean
    iconOn: string
    iconOff: string
    theme: string
    size: number
    onPress: () => void

}
const ToggleIcon = (props: ToggleIconProps) => {
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
                onPress={() => props.onPress()}
            >
                <Icons
                    style={padding}
                    name={isOn ? iconOn : iconOff}
                    color={theme}
                    size={size}
                />
            </TouchableOpacity>
        </View>
    )
}


ToggleIcon.defaultProps = {
    onPress: undefined,
    isOn: false,
    size: 25,
    paddingRight: false,
    paddingLeft: false
}

export { ToggleIcon }
