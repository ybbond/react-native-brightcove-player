import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'

const backgroundColor = 'transparent'

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        minWidth: 60,
        display: 'flex',
        flexDirection: 'row'
    }
})

class GoLive extends Component {


    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={() => this.props.seekToLive()}>
                <View style={{height:14, backgroundColor:'white', borderRadius: 5, justifyContent: 'center', flexDirection: 'row', display: 'flex'}}>
                    <View style={{
                        width: 7,
                        height: 7,
                        borderRadius: 10,
                        backgroundColor: 'green',
                        display: 'flex',
                        margin: 3
                    }}></View>

                    <View>
                        <Text style={{color: this.props.theme, display: 'flex', fontSize: 10, paddingRight: 5}}>Go Live</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

GoLive.propTypes = {
    theme: PropTypes.string.isRequired,
    seekToLive: PropTypes.func.isRequired,
}

export {GoLive}
