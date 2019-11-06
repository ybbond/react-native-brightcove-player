import {PlayerEventTypes} from "./PlayerEventTypes";
import {AppStateStatus, ViewStyle} from "react-native";
import * as React from "react";

export interface BCPlayerProps {
    autoPlay?: boolean
    paused?: boolean
    inlineOnly?: boolean
    rotateToFullScreen?: boolean
    onFullScreen: (arg: boolean) => void
    fullScreenOnly?: boolean
    onPlay: (arg: boolean) => void
    onEvent: (arg: { type: PlayerEventTypes, [q: string]: string | number | undefined }) => void
    lockPortraitOnFsExit: boolean
    style: ViewStyle
    playerId: string
    placeholder: undefined
    disableControls: false
    videoId: string
    referenceId: string
    accountId: string
    forwardedRef: any
    fullscreenStyle: ViewStyle,


}

export interface BCPlayerState {
    seeking: boolean
    paused: boolean
    fullScreen: boolean
    inlineHeight: number
    percentageTracked: { [q: string]: boolean }
    onRotate: boolean
    appState: AppStateStatus
    muted: boolean
    loading: boolean
    duration: number
    progress: number
    currentTime: number
    renderError: boolean
    qualityControlMenu: boolean
    bitRate: number
    showControls: boolean
    showClickOverlay: boolean
    seconds: number
    controlsOverlayClicked: boolean
    selectedQualityIndex: number
    completed: boolean
    isInLiveEdge: boolean | undefined
    liveEdge: number | undefined
    playerOverlayClicked: boolean
}

export interface ProgressTime {
    currentTime: number
    duration: number
    isInLiveEdge: boolean | undefined
    liveEdge: number | undefined
}

export interface MetaDataEvent extends React.BaseSyntheticEvent {
    mediainfo: { title: string }
}

export interface DefaultProps {
    placeholder: undefined
    style: ViewStyle
    autoPlay: boolean
    inlineOnly: boolean
    fullScreenOnly: boolean
    rotateToFullScreen: boolean
    lockPortraitOnFsExit: boolean
    disableControls: boolean
}