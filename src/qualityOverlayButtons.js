import React from 'react'
import PropTypes from 'prop-types'
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native'

const styles = StyleSheet.create({
    ovlyContainer: {
        zIndex: 1100,
        position: 'absolute',
        width: '100%',
        height: '85%'
    },
    individualButton: {
        padding: 2,
        borderBottomWidth: 1,
        borderColor: 'white',
        backgroundColor: 'grey'
    },
    btnContainer: {
        zIndex: 1100,
        position: 'absolute',
        bottom: 0,
        right: '20%',
        borderWidth: 1,
        borderColor: 'white'
    }
})

const QualityOverlayButtons = (props) => (<TouchableOpacity style={styles.ovlyContainer}
                                                            onPress={() => props.onPress()}>

    <View style={styles.btnContainer}>
        {
            props.qualityContent.map((data) => <TouchableOpacity color={'grey'} style={styles.individualButton}
                                                                 onPress={() => props.onPress()}>
                <Text style={{color: 'white'}}>{data}</Text></TouchableOpacity>)
        }
    </View>
</TouchableOpacity>)


QualityOverlayButtons.propTypes = {
    onPress: PropTypes.func,
    qualityContent: PropTypes.array
}

QualityOverlayButtons.defaultProps = {
    onPress: undefined
}

export {QualityOverlayButtons}