import React from 'react'
import PropTypes from 'prop-types'
import {View, StyleSheet, TouchableOpacity, Dimensions, Text, Button} from 'react-native'
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
        size,
        qualityControlMenu,
    } = props
    const qualityList = ['240', '720', '1040']
    const dim = Dimensions.get('window')

    const padding = {
        paddingLeft: paddingLeft ? 10 : 0,
        paddingRight: paddingRight ? 5 : 0
    }

    return (
        <View style={styles.btnContainer}>
            {qualityControlMenu && <View>
                {/*<TouchableOpacity  onPress={() => console.log('reached')}>*/}
                {/*    <View style={{*/}
                {/*        backgroundColor: 'red',*/}
                {/*        zIndex: 2000,*/}
                {/*        position: 'absolute',*/}
                {/*        width: '5000%',*/}
                {/*        height: dim.height,*/}
                {/*        bottom: '100%',*/}
                {/*        right: -90*/}
                {/*    }}>*/}
                {/*    </View>*/}
                {/*</TouchableOpacity>*/}
                <View style={{
                    backgroundColor: 'green',
                    zIndex: 2500,
                    position: 'absolute',
                    width: '200%',
                    bottom: '100%',
                    left: '80%'
                }}>
                    {qualityList.map((data) =>
                        <Button key={data} title={data} onPress={() => console.log('reach')}/>)}
                </View>
            </View>}
            <TouchableOpacity
                onPress={() => props.toggleQuality()}
            >
                <Icons
                    style={padding}
                    name={"volume-down"}
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

export {QualityControl}
