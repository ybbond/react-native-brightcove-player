import React, {useState, useEffect} from 'react'
import {Animated, TouchableOpacity} from 'react-native'

export const FadeInAnim = (props) => {
    const [fadeAnim] = useState(new Animated.Value(0))   // Initial value for opacity: 0

    React.useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }
        ).start(props.onEnd);
    }, [])

    return (
        <Animated.View                 // Special animatable View
            style={{
                ...props.style,
                opacity: fadeAnim,         // Bind opacity to animated value
            }}
        >
            <TouchableOpacity onPress={props.onOverlayClick} style={
                props.style// Bind opacity to animated value
            }>
                {props.children}
            </TouchableOpacity>
        </Animated.View>
    );
}

export const FadeOutAnim = (props) => {
    const [fadeAnim] = useState(new Animated.Value(1))   // Initial value for opacity: 0

    React.useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true
            }
        ).start(props.onEnd);
    }, [])

    return (
        <Animated.View                 // Special animatable View
            style={{
                ...props.style,
                opacity: fadeAnim,         // Bind opacity to animated value
            }}
        >
            {props.children}
        </Animated.View>
    );
}
