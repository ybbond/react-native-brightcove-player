import * as React from 'react'
import {Component} from 'react'
import {
    NativeModules,
    Platform,
    requireNativeComponent,
    UIManager, ViewStyle,
} from 'react-native';

import * as ReactNative from 'react-native';
import {ProgressTime} from "./BCPlayer.types";
import {PlayerEventTypes} from "./PlayerEventTypes";

export interface BrightcovePlayerProps{
    ref: (event : any) => void
    style:ViewStyle
    fullscreenStyle: ViewStyle
    playerId: string
    onBeforeEnterFullscreen: (event: object) => void
    onBeforeExitFullscreen: (event: object) => void
    disableDefaultControl: boolean
    onProgress: (event: ProgressTime) => void
    onChangeDuration: (event: {duration : number}) => void
    volume: number
    bitRate: number
    onEnd: (event: object) => void
    onBufferingStarted: (event: object) => void
    onBufferingCompleted: (event: object) => void
    autoPlay?: boolean

    onReady?: (event: object) => void
    onMetadataLoaded?: (event: {mediainfo: {title: string}}) => void
    onPlay?: (event: boolean) => void
    onPause?: (event: object) => void


    onUpdateBufferProgress?: (event: object) => void


    onEnterFullscreen?: (event: object) => void
    onExitFullscreen?: (event: object) => void
    onNetworkConnectivityChange?: (event: {status: string}) => void
    onError?: (event:  {error_code: string,errorMessage: string, message: string }) => void



    paused?: boolean
    inlineOnly?: boolean
    rotateToFullScreen?: boolean
    onFullScreen: (arg: boolean) => void
    fullScreenOnly?: boolean
    onEvent?: (arg: { type: PlayerEventTypes, [q: string]: string | number | undefined }) => void
    lockPortraitOnFsExit?: boolean

    placeholder?: undefined


}

export interface BrightcovePlayerState {

}

class BrightcovePlayer extends Component<BrightcovePlayerProps, BrightcovePlayerState> {
    _root: any
    state = {
        fullscreen: false
    };

    setNativeProps = (nativeProps: Object) => {
        if (this._root) {
            this._root.setNativeProps(nativeProps);
        }
    };

    componentWillUnmount = Platform.select({
        ios: () => {
            NativeModules.BrightcovePlayerManager.dispose(
                ReactNative.findNodeHandle(this)
            );
        },
        android: function () {
        }
    });

    setFullscreen = Platform.select({
        ios: (fullscreen: boolean) => {
            NativeModules.BrightcovePlayerManager.setFullscreen(
                ReactNative.findNodeHandle(this),
                fullscreen
            );
        },
        android : (fullscreen:  boolean) => {
            UIManager.dispatchViewManagerCommand(
                ReactNative.findNodeHandle(this._root),
                UIManager.getViewManagerConfig('BrightcovePlayer').Commands.setFullscreen,
                [fullscreen]
            );
        }
    });

  // createAirplayIconOverlay
  createAirplayIconOverlay = Platform.select({
    ios: () => {
      NativeModules.BrightcovePlayerManager.createAirplayIconOverlay(
          ReactNative.findNodeHandle(this)
      );
    }
  });

  setBitRate = Platform.select({
    ios: (prop: number) => {
      NativeModules.BrightcovePlayerManager.setBitRate(
          ReactNative.findNodeHandle(this),
          prop
      );
    },
    android: (prop) => {
      UIManager.dispatchViewManagerCommand(
          ReactNative.findNodeHandle(this._root),
          UIManager.getViewManagerConfig('BrightcovePlayer').Commands.setBitRate,
          [prop]
      );
    }
  });
  seekToLive = Platform.select({
    ios:  () =>  {
      NativeModules.BrightcovePlayerManager.seekToLive(
          ReactNative.findNodeHandle(this)
      );
    },
    android: (prop: number) => {
      UIManager.dispatchViewManagerCommand(
          ReactNative.findNodeHandle(this._root),
          UIManager.getViewManagerConfig('BrightcovePlayer').Commands.seekToLive,
          [prop]
      );
    }
  });

  playVideo = Platform.select({
    ios: (prop: boolean) => {
      NativeModules.BrightcovePlayerManager.playVideo(
          ReactNative.findNodeHandle(this),
          prop
      );
    },
    android: (prop) => {
      UIManager.dispatchViewManagerCommand(
          ReactNative.findNodeHandle(this._root),
          UIManager.getViewManagerConfig('BrightcovePlayer').Commands.playVideo,
          [prop]
      );
    }
  });

  seekTo = Platform.select({
    ios: (seconds: number) =>  {
      NativeModules.BrightcovePlayerManager.seekTo(
          ReactNative.findNodeHandle(this),
          seconds
      );
    },
    android: (seconds) => {
      UIManager.dispatchViewManagerCommand(
          ReactNative.findNodeHandle(this._root),
          UIManager.getViewManagerConfig('BrightcovePlayer').Commands.seekTo,
          [seconds]
      );
    }
  });


  render() {
        return (
            <NativeBrightcovePlayer
                ref={(e: React.Component) => (this._root = e)}
                {...this.props}
                style={[
                    this.props.style,
                    this.state.fullscreen && {
                        position: 'absolute',
                        zIndex: 9999,
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                    },
                    this.state.fullscreen && this.props.fullscreenStyle
                ]}
                onReady={(event: React.BaseSyntheticEvent) =>
                    this.props.onReady && this.props.onReady(event.nativeEvent)
                }
                onMetadataLoaded={(event: React.BaseSyntheticEvent<{mediainfo: {title: string}}>) =>
                    this.props.onMetadataLoaded && this.props.onMetadataLoaded(event.nativeEvent)
                }
                onPlay={(event: React.BaseSyntheticEvent<boolean>) =>
                    this.props.onPlay && this.props.onPlay(event.nativeEvent)
                }
                onPause={(event: React.BaseSyntheticEvent) =>
                    this.props.onPause && this.props.onPause(event.nativeEvent)
                }
                onEnd={(event: React.BaseSyntheticEvent) => this.props.onEnd && this.props.onEnd(event.nativeEvent)}
                onProgress={(event: React.BaseSyntheticEvent<ProgressTime>) =>
                    this.props.onProgress && this.props.onProgress(event.nativeEvent)
                }
                onChangeDuration={(event: React.BaseSyntheticEvent<{duration : number}>) =>
                    this.props.onChangeDuration &&
                    this.props.onChangeDuration(event.nativeEvent)
                }
                onUpdateBufferProgress={(event: React.BaseSyntheticEvent) =>
                    this.props.onUpdateBufferProgress &&
                    this.props.onUpdateBufferProgress(event.nativeEvent)
                }
                onBufferingStarted={(event: React.BaseSyntheticEvent) =>
                    this.props.onBufferingStarted &&
                    this.props.onBufferingStarted(event.nativeEvent)
                }
                onBufferingCompleted={(event: React.BaseSyntheticEvent) =>
                    this.props.onBufferingCompleted &&
                    this.props.onBufferingCompleted(event.nativeEvent)
                }
                onBeforeEnterFullscreen={(event: React.BaseSyntheticEvent) => {
                    this.props.onBeforeEnterFullscreen &&
                    this.props.onBeforeEnterFullscreen(event.nativeEvent)
                }}
                onBeforeExitFullscreen={(event: React.BaseSyntheticEvent) => {
                    this.props.onBeforeExitFullscreen &&
                    this.props.onBeforeExitFullscreen(event.nativeEvent)
                }}
                onEnterFullscreen={(event: React.BaseSyntheticEvent) => {
                    this.props.onEnterFullscreen &&
                    this.props.onEnterFullscreen(event.nativeEvent)
                    this.setState({fullscreen: true})
                }}
                onExitFullscreen={(event: React.BaseSyntheticEvent) => {
                    this.props.onExitFullscreen &&
                    this.props.onExitFullscreen(event.nativeEvent)
                    this.setState({fullscreen: false})
                }}
                onNetworkConnectivityChange={(event: React.BaseSyntheticEvent<{status: string}>) => {
                    this.props.onNetworkConnectivityChange && this.props.onNetworkConnectivityChange(event.nativeEvent)
                }}
                onError={(event: React.BaseSyntheticEvent<{error_code: string,errorMessage: string, message: string }>) => {
                    this.props.onError && this.props.onError(event.nativeEvent)
                }}
            />
        );
    }
}



const NativeBrightcovePlayer = requireNativeComponent(
    'BrightcovePlayer'
);

export default BrightcovePlayer;
