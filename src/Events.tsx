import * as React from 'react'
import {Component} from 'react'
import {Platform} from 'react-native'
import {PlayerEventTypes} from "./PlayerEventTypes";
import {BrightcovePlayerProps, BrightcovePlayerState} from "./BrightcovePlayer";
import {ProgressTime} from "./BCPlayer.types";

// This function takes a component...
interface BCPlayerComponentWithEventsProps extends BrightcovePlayerProps {
    onEvent: (event: { type: PlayerEventTypes, [q: string]: string | number | undefined }) => void
    videoId: string
    referenceId: string
    accountId: string
    playerId: string
    forwardedRef: any
    disableDefaultControl: boolean
    bitRate: number
    onBufferingStarted: (event: object) => void
    onBufferingCompleted: (event: object) => void
    onEnd: (event: object) => void
    autoPlay: boolean
    volume: number
}

interface BCPlayerComponentWithEventsState extends BrightcovePlayerState {
    firstPlayed: boolean
    percentageTracked: { [q: string]: boolean }
    mediainfo: { title: string } | null | undefined
    quality: string

}

function withEvents(BCPlayerComponent: new (props: BrightcovePlayerProps) => React.Component<BrightcovePlayerProps>) {
    // ...and returns another component...
    class BCPlayerComponentWithEvents extends Component<BCPlayerComponentWithEventsProps, BCPlayerComponentWithEventsState> {
        constructor(props: BCPlayerComponentWithEventsProps) {
            super(props);
            this.state = {
                percentageTracked: {Q1: false, Q2: false, Q3: false, Q4: false},
                mediainfo: null,
                firstPlayed: false,
                quality: 'Auto'
            }
        }

        /**
         * Event triggered when the player is ready to play
         * @param {NativeEvent} event
         */
        onReady(event: object) {
            this.onEvent({'type': PlayerEventTypes.READY});
            this.onEvent({'type': PlayerEventTypes.IMPRESSION});
            this.props.onReady && this.props.onReady(event);
        }

        /**
         * Event triggered when the player sets the metadata
         * @param {NativeEvent} event
         */
        onMetadataLoaded(event: { mediainfo: { title: string } }) {
            this.setState({mediainfo: event.mediainfo}, () => {
                this.onEvent({'type': PlayerEventTypes.METADATA_LOADED});
            });
            this.props.onMetadataLoaded && this.props.onMetadataLoaded(event);
        }

        /**
         * Event triggered everytime that it starts playing. Can be when it starts, or when it resumes from pause
         * @param {NativeEvent} event
         */
        onPlay(event: boolean) {
            this.onEvent({'type': PlayerEventTypes.PLAY});

            if (!this.state.firstPlayed) {
                this.setState({firstPlayed: true}, () => {
                    this.onEvent({'type': PlayerEventTypes.VIEW});
                });
            }
            this.props.onPlay && this.props.onPlay(event);
        }

        /**
         * Event triggered everytime the user clicks pause
         * @param {NativeEvent} event
         */
        onPause(event: object) {
            this.onEvent({'type': PlayerEventTypes.PAUSE});
            this.props.onPause && this.props.onPause(event);
        }

        /**
         * Event triggered when the video ends
         * @param {NativeEvent} event
         */
        onEnd(event: object) {
            this.onEvent({'type': PlayerEventTypes.END});
            this.props.onEnd && this.props.onEnd(event);
        }


        /**
         * Event triggered when buffering started
         * @param {NativeEvent} event
         */
        onBufferingStarted(event: object) {
            this.onEvent({'type': PlayerEventTypes.BUFFERING_STARTED});
            this.props.onBufferingStarted && this.props.onBufferingStarted(event);
        }

        /**
         * Event triggered when the video ends
         * @param {NativeEvent} event
         */
        onBufferingCompleted(event: object) {
            this.onEvent({'type': PlayerEventTypes.BUFFERING_COMPLETED});
            this.props.onBufferingCompleted && this.props.onBufferingCompleted(event);
        }

        /**
         * Event trigger when there is a change in the connectivity
         * @param {NativeEvent} event
         */
        onNetworkConnectivityChange(event: { status: string }) {
            this.onEvent({'type': PlayerEventTypes.NETWORK_CONNECTIVITY_CHANGE, status: event.status});
            this.props.onNetworkConnectivityChange && this.props.onNetworkConnectivityChange(event);
        }


        /**
         * Event triggered as the stream progress.
         * @param {NativeEvent} event
         * @param {number} event.currentTime - The current time of the video
         * @param {number} event.duration - The total duration of the video
         */
        onProgress(event: ProgressTime) {
            const {currentTime, duration} = event,
                {percentageTracked} = this.state;

            if (duration > -1) {
                /*
                * Calculate the percentage played
                */
                let percentagePlayed = Math.round(currentTime / duration * 100),
                    roundUpPercentage = Math.ceil(percentagePlayed / 25) * 25 || 25; // make sure that 0 is 25

                /**
                 * The following logic is applied:
                 * Between 0% - 25% - Track Q1 mark
                 * Between 25% - 50% - Track Q2 mark
                 * Between 50% - 75% - Track Q3 mark
                 * Between 75% - 100% - Track Q4 mark
                 */
                if (roundUpPercentage === 25 && !percentageTracked.Q1) {
                    this.trackQuarters(1, percentagePlayed);
                } else if (roundUpPercentage === 50 && !percentageTracked.Q2) {
                    this.trackQuarters(2, percentagePlayed);
                } else if (roundUpPercentage === 75 && !percentageTracked.Q3) {
                    this.trackQuarters(3, percentagePlayed);
                } else if (roundUpPercentage === 100 && !percentageTracked.Q4) {
                    this.trackQuarters(4, percentagePlayed);
                }
            }

            // Fire the call back of the onProgress
            this.props.onProgress && this.props.onProgress(event);
        }

        getPlayerMark(mark: number) {
            switch (mark) {
                case 1:
                    return PlayerEventTypes.PROGRESS_Q1
                case 2:
                    return PlayerEventTypes.PROGRESS_Q2
                case 3:
                    return PlayerEventTypes.PROGRESS_Q3
                case 4:
                    return PlayerEventTypes.PROGRESS_Q4
                default:
                    return PlayerEventTypes.PROGRESS_Q1
            }
        }

        /**
         * Method that tracks back to the "onEvent" call back to communicate a tracking of a quarter
         * @param {number} mark - The number of the quarter (1,2,3,4)
         * @param {number} percentagePlayed - The percentage played at the time of the tracking
         */
        trackQuarters(mark: number, percentagePlayed: number) {
            this.setState((prevState) => ({
                percentageTracked: {
                    ...prevState.percentageTracked,
                    [`Q${mark}`]: true
                }
            }));

            this.onEvent({
                type: this.getPlayerMark(mark),
                percentagePlayed
            });
        }

        /**
         * Event triggered when the fullscreen happens
         * @param {NativeEvent} event
         */
        onEnterFullscreen(event: object) {
            this.onEvent({'type': PlayerEventTypes.ENTER_FULLSCREEN});
            this.props.onEnterFullscreen && this.props.onEnterFullscreen(event);
        }

        /**
         * Event triggered when the user exists from the fullscreen
         * @param {NativeEvent} event
         */
        onExitFullscreen(event: object) {
            this.onEvent({'type': PlayerEventTypes.EXIT_FULLSCREEN});
            this.props.onExitFullscreen && this.props.onExitFullscreen(event);
        }

        /**
         * Event triggered when an error gets triggered
         * @param {NativeEvent} event
         */
        onError(event: { error_code: string, errorMessage: string, message: string }) {

            // Make sure that if an errorCode or errorMessage is passed, then
            if (!event.error_code && !(event.errorMessage || event.message)) {
                return;
            }

            let {errorCode, errorMessage} = this.normaliseErrorCodes({
                errorCode: event.error_code,
                errorMessage: event.errorMessage || event.message
            });

            this.onEvent({
                'type': PlayerEventTypes.ERROR,
                errorCode,
                errorMessage
            });
            this.props.onError && this.props.onError(event);
        }

        /**
         * Some of the errors are not very consistent. So we need to normalise them in order to get proper meaninful messages
         * and make sure ios and Android are aligned with the same errors
         * @params error {object} - Error object
         * @params error.error_code - The error code sent from native
         * @params error.errorMessage - error message
         */
        normaliseErrorCodes({error_code, errorMessage}: { error_code?: string, errorMessage: string, errorCode?: string }) {

            if (Platform.OS === 'android') {
                // This happens on Android, it means that the internet might be down or it couldn't get through the segments
                if (errorMessage === 'onLoadError: sourceId: -1') {
                    return {
                        errorCode: 'LOAD_ERROR',
                        errorMessage: 'There was an error trying to play the video. Check your internet connection.'
                    }
                }

                // This happens on Android, it means that it cannot process the video anymore.
                // One scenario is that it retried to download the segments a few times and it failed, so this event gets thrown
                if (errorMessage === 'onPlayerError') {
                    return {
                        errorCode: 'PLAYER_ERROR',
                        errorMessage: 'There was an error with the player. Check your internet connection and refresh.'
                    }
                }
            }

            if (Platform.OS === 'ios') {
                /**
                 * Error Code that indicates there was an error connecting to the Playback API.
                 */
                if (error_code === '1') {
                    return {
                        errorCode: 'LOAD_ERROR',
                        errorMessage: 'There was an error trying to play the video. Check your internet connection.' + ((errorMessage) ? `(${errorMessage})` : '')
                    }
                }

                /**
                 * Error Code that indicates there was an error returned by the API. It could be any error from the API.
                 */
                if (error_code === '3') {
                    error_code = 'PLAYER_ERROR';
                }
            }

            // If no error code is defined, then use a generic one, and pass the error message or the default 'There was an error'
            return {errorCode: error_code || 'ERROR', errorMessage: errorMessage || 'There was an error!'}
        }

        /**
         * Handler to normalise the events and send it back to the onEvent callback if that exists
         * @param {object} event
         * @param {string} event.type - the event type
         */
        onEvent(event: {
            type: PlayerEventTypes,
            percentagePlayed?: number,
            errorCode?: string,
            errorMessage?: string,
            status?: string
        }) {
            const eventObj = {
                ...event,
                name: this.state.mediainfo && this.state.mediainfo.title || 'N/A',
                videoId: this.props.videoId,
                referenceId: this.props.referenceId,
                accountId: this.props.accountId,
                playerId: this.props.playerId,
                platform: Platform.OS
            }
            this.props.onEvent && this.props.onEvent(eventObj);
        }

        render() {
            const {forwardedRef, ...props} = this.props;

            // ... and renders the wrapped component with the fresh data!
            // Notice that we pass through any additional props
            return (<BCPlayerComponent
                {...props}
                ref={forwardedRef}
                onReady={this.onReady.bind(this)}
                onMetadataLoaded={this.onMetadataLoaded.bind(this)}
                onPlay={this.onPlay.bind(this)}
                onPause={this.onPause.bind(this)}
                onEnd={this.onEnd.bind(this)}
                onProgress={this.onProgress.bind(this)}
                onBufferingStarted={this.onBufferingStarted.bind(this)}
                onBufferingCompleted={this.onBufferingCompleted.bind(this)}
                onNetworkConnectivityChange={this.onNetworkConnectivityChange.bind(this)}
                onEnterFullscreen={this.onEnterFullscreen.bind(this)}
                onExitFullscreen={this.onExitFullscreen.bind(this)}
                onError={this.onError.bind(this)}
            />)
        }
    }

    const forwardComponent = React.forwardRef((props: BCPlayerComponentWithEventsProps, ref) => {
        return <BCPlayerComponentWithEvents {...props} forwardedRef={ref}/>;
    });

    // // Rename the new component name to be the same as the high order component
    // // This is done because there are other components that looks up to the name of the BCPlayer (like ScrollView)
    forwardComponent.displayName = 'BrightcovePlayer';
    return forwardComponent;
}

export default withEvents;