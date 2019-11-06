import * as React from 'react'
import * as PropTypes from 'prop-types'
import {View, StyleSheet, TouchableOpacity, Text, SafeAreaView} from 'react-native'

const styles = StyleSheet.create({
    ovlySafeContainer: {
        zIndex: 110,
        position: 'absolute',
        width: '100%',
        height: '85%',
    },
    ovlyContainer: {
        zIndex: 110,
        width: '100%',
        height: '85%',
    },
    individualButton: {
        height: 30,
        paddingTop: 5

    },
    borderAttribute: {
        borderBottomWidth: 1,
        borderColor: '#e8e8e8',
        width:'100%'

    },
    btnContainer: {
        zIndex: 110,
        position: 'absolute',
        top: 10,
        right: 78,
        borderWidth: 1,
        borderColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'white',
        borderRadius: 5,

    },
    arrowIcon:{
        zIndex: 110,
        width: 8,
        height: 8,
        right: 76,
        top: 15,
        backgroundColor: 'white',
        position: 'absolute',
        transform: [{rotate : '45deg'}]

    }
})
interface QualityOverlayButtonsProps{
    onPress: (arg: number | null) => void
    qualityContent: string[]
    selectedQualityIndex: number
}

const QualityOverlayButtons = (props: QualityOverlayButtonsProps) => (<SafeAreaView style={styles.ovlySafeContainer}><TouchableOpacity style={styles.ovlyContainer}
                                                                                                           onPress={() => props.onPress(null)}>
    <View style={styles.arrowIcon}>
    </View>

    <View style={styles.btnContainer}>
        {
            props.qualityContent.map((data, index) => <TouchableOpacity onPress={() => props.onPress(index)} key={index}>
                <View style={[{flex:1}, !(props.qualityContent.length - 1 === index) ? styles.borderAttribute : null]}>
                    <Text style={[styles.individualButton, {color: props.selectedQualityIndex === index ? '#ff5000' :'#9b9b9b'}]}>{data}</Text></View></TouchableOpacity>)
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