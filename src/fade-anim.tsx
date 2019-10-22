import  {useState} from 'react'
import * as React from 'react'
import {Animated, TouchableOpacity, ViewStyle} from 'react-native'

interface FadeInAnimProps {
    onEnd : ()=> void
    style: ViewStyle
    onOverlayClick: () => void
    children: JSX.Element

}

interface FadeOutAnimProps extends FadeInAnimProps{

}
export const FadeInAnim = (props: FadeInAnimProps) => {
    const [fadeAnim] = useState(new Animated.Value(0))   // Initial value for opacity: 0

    React.useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 500,
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


export const FadeOutAnim = (props: FadeOutAnimProps) => {
    const [fadeAnim] = useState(new Animated.Value(1))   // Initial value for opacity: 0

    React.useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 0,
                duration: 500,
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
