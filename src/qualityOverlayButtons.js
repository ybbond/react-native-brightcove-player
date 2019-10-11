import React from 'react'
import PropTypes from 'prop-types'
import {View, StyleSheet, TouchableOpacity, Text, SafeAreaView} from 'react-native'

const styles = StyleSheet.create({
    ovlySafeContainer: {
        zIndex: 1000,
        position: 'absolute',
        width: '100%',
        height: '85%',
    },
    ovlyContainer: {
        zIndex: 1000,
        width: '100%',
        height: '85%',
    },
    individualButton: {
        padding: 2,
        paddingBottom: 10,
        paddingTop: 10

    },
    borderAttribute: {
        borderBottomWidth: 1,
        borderColor: '#e8e8e8'
    },
    btnContainer: {
        zIndex: 1000,
        position: 'absolute',
        top: 5,
        right: 60,
        borderWidth: 1,
        borderColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    arrowIcon:{
        zIndex: 1000,
        width: 8,
        height: 8,
        right: 58,
        top: 10,
        backgroundColor: 'white',
        position: 'absolute',
        transform: [{rotate : '45deg'}]

    }
})

const QualityOverlayButtons = (props) => (<SafeAreaView style={styles.ovlySafeContainer}><TouchableOpacity style={styles.ovlyContainer}
                                                                                                           onPress={props.onPress(null)}>
    <View style={styles.arrowIcon}>
    </View>

    <View style={styles.btnContainer}>
        {
            props.qualityContent.map((data, index) => <TouchableOpacity style={[styles.individualButton, !(props.qualityContent.length - 1 === index) ? styles.borderAttribute : null]}
                                                                        onPress={props.onPress(index)} key={index}>
                <Text style={{color: props.selectedQualityIndex === index ? '#ff5000' :'#9b9b9b'}}>{data}</Text></TouchableOpacity>)
        }
    </View>
</TouchableOpacity></SafeAreaView>)


QualityOverlayButtons.propTypes = {
    onPress: PropTypes.func,
    qualityContent: PropTypes.array
}

QualityOverlayButtons.defaultProps = {
    onPress: undefined
}

export {QualityOverlayButtons}