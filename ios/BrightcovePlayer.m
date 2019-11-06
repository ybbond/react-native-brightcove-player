#import "BrightcovePlayer.h"
#import "BrightcovePlayerOfflineVideoManager.h"

@interface BrightcovePlayer () <BCOVPlaybackControllerDelegate, BCOVPUIPlayerViewDelegate, AkamaiPlayerDataProtocol>

#pragma mark - Properties

@property (nonatomic) NSLayoutConstraint *centreHorizontallyConstraint;
@property (nonatomic) NSLayoutConstraint *centreVerticallyConstraint;
@property (nonatomic) NSLayoutConstraint *widthConstraint;
@property (nonatomic) NSLayoutConstraint *heightConstraint;
@property (nonatomic) int watchedTime;
@property (nonatomic, strong) NSTimer *countTimer;
@property (nonatomic, strong) NSTimer *sendTimer;
@property (nonatomic) long currentBytesLoaded;
@property (nonatomic) NSInteger currentDroppedFrames;
@property (nonatomic) float lastBitRate;
@property (nonatomic) NSString *streamUrl;

#pragma mark - Constants

#define kAnalyticDataType [NSMutableArray arrayWithObjects:@"title",@"contentLength",@"device",@"playerId",@"eventName", nil]
#define kNameKey @"name"
#define kDurationKey @"duration"
#define kAkamaiEventName @"ReactNativeBrightcovePlayer"
#define kMediaInfoKey @"mediainfo"
#define kTitleKey @"title"
#define kStatusKey @"status"
#define kStalledValue @"stalled"
#define kRecoveredValue @"recovered"
#define kErrorKey @"error"
#define kCurrentTimeKey @"currentTime"
#define kBufferProgressKey @"bufferProgress"
#define kErrorCodeKey @"error_code"
#define kMessageKey @"message"
#define kPlaybackEnd @"Playback session lifecycle event end"
#define kPlaybackExit @"Playback exit"

@end

@implementation BrightcovePlayer

@synthesize playbackSession;

#pragma mark - Lifecycle

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        [self setup];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleApplicationEnterForeground:)
                                                     name:UIApplicationWillEnterForegroundNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(handleAVPlayerAccess:)
                                                     name:AVPlayerItemNewAccessLogEntryNotification
                                                   object:nil];

        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(handleApplicationWillTerminate:)
                                                     name:UIApplicationWillTerminateNotification
                                                   object:nil];
    }
    return self;
}

- (id<BCOVPlaybackController>)createPlaybackController {
    BCOVBasicSessionProviderOptions *options = [BCOVBasicSessionProviderOptions alloc];
    BCOVBasicSessionProvider *provider = [[BCOVPlayerSDKManager sharedManager] createBasicSessionProviderWithOptions:options];
    return [BCOVPlayerSDKManager.sharedManager createPlaybackControllerWithSessionProvider:provider viewStrategy:nil];
}

- (void)dispose {
    [_analytics handlePlayEnd:kPlaybackExit];
    [self.playbackController setVideos:@[]];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

#pragma mark - Setups

- (void)startSendTimer {
    if (self.sendTimer == nil) {
        if (@available(iOS 10.0, *)) {
            self.sendTimer = [NSTimer scheduledTimerWithTimeInterval:30.0 repeats:YES block:^(NSTimer * _Nonnull timer) {
                if (self.onWatchedTime && _playing) {
                    self.onWatchedTime(@{ @"WATCHED_TIME": [NSNumber numberWithInt:self.watchedTime] });
                }
            }];
        }
    }
}

- (void)stopSendTimer {
    [self.sendTimer invalidate];
    self.sendTimer = nil;
}

- (void)startCountTimer {
    if (self.countTimer == nil) {
        if (@available(iOS 10.0, *)) {
            self.countTimer = [NSTimer scheduledTimerWithTimeInterval:1.0 repeats:YES block:^(NSTimer * _Nonnull timer) {
                if (self.playing) {
                    self.watchedTime++;
                }
            }];
        }
    }
}

- (void)stopCountTimer {
    [self.countTimer invalidate];
    self.countTimer = nil;
}

- (void)resetWatchedTime {
    self.watchedTime = 1;
}

- (void)setup {
    _playbackController = [BCOVPlayerSDKManager.sharedManager createPlaybackController];
    _playbackController.delegate = self;
    _playbackController.autoPlay = NO;
    _playbackController.autoAdvance = YES;
    [_playbackController setAllowsExternalPlayback:YES];

    _playerView = [[BCOVPUIPlayerView alloc] initWithPlaybackController:self.playbackController options:nil controlsView:[BCOVPUIBasicControlView basicControlViewWithVODLayout]];
    _playerView.delegate = self;
    _playerView.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;
    _playerView.backgroundColor = UIColor.blackColor;

    // Hide the controls until it defines which controls to use based on the READY state
    _playerView.controlsView.hidden = true;

    _targetVolume = 1.0;
    _autoPlay = NO;

    [self addSubview:_playerView];

    [self resetWatchedTime];
}

- (void)setupService {
    if ((!_playbackService || _playbackServiceDirty) && _accountId && _policyKey) {
        _playbackServiceDirty = NO;
        _playbackService = [[BCOVPlaybackService alloc] initWithAccountId:_accountId policyKey:_policyKey];
    }
}

#pragma mark - Akamai Analytics

- (void)setupAnalytics {
    _analytics = [[AkamaiMediaAnalytics alloc] initWithConfigurationUrl:@"https://ma1442-r.analytics.edgekey.net/config/beacon-25672.xml"];

    [_analytics setDebugLogging:YES];
    [_analytics enableServerIpLookup];
    [_analytics enableLocation];
    [_analytics handleSessionInit:self withStreamUrl:_streamUrl];

    [self setupAnalyticsData];
}

- (void)setupAnalyticsData {
    [_analytics setData:[kAnalyticDataType objectAtIndex:title] value:_mediaInfo[kNameKey]];
    [_analytics setData:[kAnalyticDataType objectAtIndex:contentLength] value:[NSString stringWithFormat:@"%@", _mediaInfo[kDurationKey]]];
    [_analytics setData:[kAnalyticDataType objectAtIndex:device] value:deviceName()];
    [_analytics setData:[kAnalyticDataType objectAtIndex:playerId] value:_playerId];
    [_analytics setData:[kAnalyticDataType objectAtIndex:eventName] value:kAkamaiEventName];

    NSString *uuid = [[NSUUID UUID] UUIDString];

    [_analytics setViewerId:uuid];
    [_analytics setViewerId:uuid];
}

#pragma mark - Notifications

- (void)handleApplicationEnterForeground:(NSNotification *)notification {
    [self setupAnalytics];
}

- (void)handleAVPlayerAccess:(NSNotification *)notification {
    AVPlayerItemAccessLog *accessLog = [((AVPlayerItem *)notification.object) accessLog];
    AVPlayerItemAccessLogEvent *lastEvent = accessLog.events.lastObject;
    float lastEventNumber = lastEvent.indicatedBitrate;
    if (lastEventNumber != self.lastBitRate) {
        NSLog(@"Switch indicatedBitrate from: %f to: %f", self.lastBitRate, lastEventNumber);
        self.lastBitRate = lastEventNumber;

        [_analytics handleBitrateChange:self.lastBitRate];
    }
}

- (void)handleApplicationWillTerminate:(NSNotification *)notification {
    [_analytics handleApplicationExit];
}

#pragma mark - Device Information

- (void)didJumpBack {
    [_playbackController seekToTime:CMTimeMakeWithSeconds(CMTimeGetSeconds(playbackSession.player.currentTime) - 15, NSEC_PER_SEC) completionHandler:^(BOOL finished) {
        if (self.onRewind) {
            self.onRewind(@{ });
        }
    }];
}

- (void)didPressLive {
    [self seekToLive];
}

NSString *deviceName() {
    struct utsname systemInfo;
    uname(&systemInfo);

    return [NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding];
}

#pragma mark - Loads

- (void)loadMovie {
    if (_videoToken) {
        BCOVVideo *video = [[BrightcovePlayerOfflineVideoManager sharedManager] videoObjectFromOfflineVideoToken:_videoToken];
        if (video) {
            [self.playbackController setVideos: @[ video ]];
        }
        return;
    }

    if (!_playbackService) return;

    if (_videoId) {
        [_playbackService findVideoWithVideoID:_videoId parameters:nil completion:^(BCOVVideo *video, NSDictionary *jsonResponse, NSError *error) {
            if (video) {
                _mediaInfo = jsonResponse;
                _streamUrl = [self getStreamUrlFor:video videoId:_videoId];
                [self.playbackController setVideos: @[ video ]];
            } else {
                [self emitError:error];
            }
        }];
    } else if (_referenceId) {
        [_playbackService findVideoWithReferenceID:_referenceId parameters:nil completion:^(BCOVVideo *video, NSDictionary *jsonResponse, NSError *error) {
            if (video) {
                _mediaInfo = jsonResponse;
                _streamUrl = [self getStreamUrlFor:video videoId:_referenceId];
                [self.playbackController setVideos: @[ video ]];
            } else {
                [self emitError:error];
            }
        }];
    }
}

- (NSString *)getStreamUrlFor:(BCOVVideo *)video videoId:(NSString *)vId {
    for (BCOVSource *source in video.sources) {
        if ([source.url.absoluteString containsString:vId]) {
            return source.url.absoluteString;
        }
    }

    return nil;
}

#pragma mark - Setters

- (void)setPlaybackSession:(id<BCOVPlaybackSession>)_playbackSession {
    playbackSession = _playbackSession;
    [self setupAnalytics];
}

- (void)setReferenceId:(NSString *)referenceId {
    _referenceId = referenceId;
    _videoId = NULL;
    [self setupService];
    [self loadMovie];
}

- (void)setVideoId:(NSString *)videoId {
    _videoId = videoId;
    _referenceId = NULL;
    [self setupService];
    [self loadMovie];
}

- (void)setVideoToken:(NSString *)videoToken {
    _videoToken = videoToken;
    [self loadMovie];
}

- (void)setAccountId:(NSString *)accountId {
    _accountId = accountId;
    _playbackServiceDirty = YES;
    _playbackController.analytics.account = accountId;
    [self setupService];
    [self loadMovie];
}

- (void)setPlayerId:(NSString *)playerId {
    _playerId = playerId;
    _playbackController.analytics.destination = [NSString stringWithFormat: @"bcsdk://%@", playerId];
    [self setupService];
    [self loadMovie];
}

- (void)setPlayerType:(NSString *)type {
    _playerType = type;
}

- (void)setPolicyKey:(NSString *)policyKey {
    _policyKey = policyKey;
    _playbackServiceDirty = YES;
    [self setupService];
    [self loadMovie];
}

- (void)setAutoPlay:(BOOL)autoPlay {
    _autoPlay = autoPlay;
}

- (void)setPlay:(BOOL)play {
    if (_playing && play) return;
    if (play) {
        [_playbackController play];
    } else {
        [_playbackController pause];
        _playing = FALSE;
    }
}

- (void)setFullscreen:(BOOL)fullscreen {
    if (fullscreen) {
        [_playerView performScreenTransitionWithScreenMode:BCOVPUIScreenModeFull];
    } else {
        [_playerView performScreenTransitionWithScreenMode:BCOVPUIScreenModeNormal];
    }
}

- (void)setVolume:(NSNumber*)volume {
    _targetVolume = volume.doubleValue;
    [self refreshVolume];
}

- (void)setBitRate:(NSNumber*)bitRate {
    _targetBitRate = bitRate.doubleValue;
    [self refreshBitRate];
}

- (void)setPlaybackRate:(NSNumber*)playbackRate {
    _targetPlaybackRate = playbackRate.doubleValue;
    if (_playing) {
        [self refreshPlaybackRate];
    }
}

- (void)refreshVolume {
    if (!self.playbackSession) return;
    self.playbackSession.player.volume = _targetVolume;
}

- (void)refreshBitRate {
    if (!self.playbackSession) return;
    AVPlayerItem *item = self.playbackSession.player.currentItem;
    if (!item) return;
    item.preferredPeakBitRate = _targetBitRate;
}

- (void)refreshPlaybackRate {
    if (!self.playbackSession || !_targetPlaybackRate) return;
    self.playbackSession.player.rate = _targetPlaybackRate;
}

- (void)setDisableDefaultControl:(BOOL)disable {
    _disableDefaultControl = disable;
    _playerView.controlsView.hidden = disable;
}

- (void)seekTo:(NSNumber *)time {
    [_playbackController seekToTime:CMTimeMakeWithSeconds([time floatValue], NSEC_PER_SEC) completionHandler:^(BOOL finished) {
    }];
}

#pragma mark - BCOVPlaybackControllerDelegate

- (NSNumber *)liveEdge {
    CMTimeRange seekableRange = [playbackSession.player.currentItem.seekableTimeRanges.lastObject CMTimeRangeValue];
    CGFloat seekableStart = CMTimeGetSeconds(seekableRange.start);
    CGFloat seekableDuration = CMTimeGetSeconds(seekableRange.duration);
    CGFloat livePosition = seekableStart + seekableDuration;
    return @(!isnan(livePosition) ? livePosition : 0);
}

- (void)seekToLive {
    [self seekTo:[self liveEdge]];
}

- (void)playbackController:(id<BCOVPlaybackController>)controller playbackSession:(id<BCOVPlaybackSession>)session didReceiveLifecycleEvent:(BCOVPlaybackSessionLifecycleEvent *)lifecycleEvent {

    [self createAirplayIconOverlay];

    if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventReady) {

        if ([[_playerType uppercaseString] isEqualToString:@"LIVE"]) {
            _playerView.controlsView.layout = [BCOVPUIControlLayout basicLiveControlLayout];
        } else if ([[_playerType uppercaseString] isEqualToString:@"DVR"]) {
            _playerView.controlsView.layout = [BCOVPUIControlLayout basicLiveDVRControlLayout];
        } else {
            _playerView.controlsView.layout = [BCOVPUIControlLayout basicVODControlLayout];
        }

        // Once the controls are set to the layout, define the controls to the state sent to the player
        _playerView.controlsView.hidden = _disableDefaultControl;

        // Override Jump back button action to track event

        [_playerView.controlsView.jumpBackButton addTarget:self action:@selector(didJumpBack) forControlEvents:UIControlEventTouchUpInside];

        // Add Live button action to track event

        [_playerView.controlsView.liveButton addTarget:self action:@selector(didPressLive) forControlEvents:UIControlEventTouchUpInside];

        UITapGestureRecognizer *seekToTimeTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleSeekToTimeTap:)];
        [_playerView.controlsView.progressSlider addGestureRecognizer:seekToTimeTap];

        [self refreshVolume];
        [self refreshBitRate];

        if (self.onReady) {
            self.onReady(@{});
        }

        if (self.onMetadataLoaded) {
            NSDictionary *mediainfo = @{ kTitleKey : _mediaInfo[kNameKey]};
            self.onMetadataLoaded(@{
                kMediaInfoKey: mediainfo
            });
        }
        if (_autoPlay && _playing) {
            [_playbackController play];
        }
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPlay) {
        _playing = true;
        [self refreshPlaybackRate];
        if (self.onPlay) {
            self.onPlay(@{});
        }

        [self startSendTimer];
        [self startCountTimer];

        [_analytics handlePlaying];
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPause) {
        if (_playing) {
            _playing = false;
            if (self.onPause) {
                self.onPause(@{});
            }

            [self stopCountTimer];

            // Hide controls view after pause a video
            [self refreshControlsView];

            [_analytics handlePause];
        }
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventEnd) {
        if (self.onEnd) {
            self.onEnd(@{});
        }

        [self stopCountTimer];
        [self stopSendTimer];
        [self resetWatchedTime];

        [_analytics handlePlayEnd:kPlaybackEnd];
    }

     /**
      * The playback buffer is empty. This will occur when the video initially loads,
      * after a seek occurs, and when playback stops because of a slow or disabled
      * network. When the buffer is full enough to start playback again,
      * kBCOVPlaybackSessionLifecycleEventPlaybackLikelyToKeepUp will be sent.
      */
     if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPlaybackBufferEmpty) {
        if (self.onBufferingStarted) {
            self.onBufferingStarted(@{});
        }

         if (_playing) {
             [_analytics handleBufferStart];
         }
     }
     /**
      * After becoming empty, this event is sent when the playback buffer has filled
      * enough that it should be able to keep up with playback. This event will come after
      * kBCOVPlaybackSessionLifecycleEventPlaybackBufferEmpty.
      */
     if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPlaybackLikelyToKeepUp) {
        if (self.onBufferingCompleted) {
            self.onBufferingCompleted(@{});
        }

         if (_playing) {
             [_analytics handleBufferEnd];
         }
     }
     /**
      * Playback of the video has stalled. When the video recovers,
      * kBCOVPlaybackSessionLifecycleEventPlaybackRecovered will be sent.
      */
     if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPlaybackStalled) {
        if (self.onNetworkConnectivityChange) {
            self.onNetworkConnectivityChange(@{kStatusKey: kStalledValue});
        }
     }
     /**
      * Playback has recovered after being stalled.
      */
     if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventPlaybackRecovered) {
        if (self.onNetworkConnectivityChange) {
            self.onNetworkConnectivityChange(@{kStatusKey: kRecoveredValue});
        }
     }
     /**
      * A generic error has occurred.
      */
    if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventError) {
        NSError *error = lifecycleEvent.properties[kErrorKey];
        NSLog(@"Lifecycle Event Fail error: %@", error);
        [self emitError:error];
     /**
      * The video failed to load.
      */
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventFail) {
        NSError *error = lifecycleEvent.properties[kErrorKey];
        NSLog(@"Lifecycle Event Fail error: %@", error);
        [self emitError:error];
     /**
      * The video failed during playback and was unable to recover, possibly due to a
      * network error.
      */
    } else if (lifecycleEvent.eventType == kBCOVPlaybackSessionLifecycleEventFailedToPlayToEndTime) {
        NSError *error = lifecycleEvent.properties[kErrorKey];
        NSLog(@"Lifecycle Event Fail error: %@", error);
        [self emitError:error];
    }
}

- (void)playbackController:(id<BCOVPlaybackController>)controller playbackSession:(id<BCOVPlaybackSession>)session didChangeDuration:(NSTimeInterval)duration {
    _segmentDuration = duration;
    if (self.onChangeDuration) {
        self.onChangeDuration(@{
                                kDurationKey: @(duration)
                                });
    }
}

- (void)playbackController:(id<BCOVPlaybackController>)controller playbackSession:(id<BCOVPlaybackSession>)session didProgressTo:(NSTimeInterval)progress {
    NSTimeInterval duration = CMTimeGetSeconds(session.player.currentItem.duration);
    if (self.onProgress && progress > 0 && progress != INFINITY) {
        self.onProgress(@{
                          kCurrentTimeKey: @(progress),
                          kDurationKey: @(!isnan(duration) ? duration : -1),
                          @"liveEdge": [self liveEdge],
                          @"isInLiveEdge": @(abs((int)(progress - [[self liveEdge] doubleValue])) < 7)
                          });
    }
    float bufferProgress = _playerView.controlsView.progressSlider.bufferProgress;
    if (_lastBufferProgress != bufferProgress) {
        _lastBufferProgress = bufferProgress;
        self.onUpdateBufferProgress(@{
                                      kBufferProgressKey: @(bufferProgress),
                                      kDurationKey: @(!isnan(duration) ? duration : -1)
                                      });
    }
}

- (void)playerView:(BCOVPUIPlayerView *)playerView willTransitionToScreenMode:(BCOVPUIScreenMode)screenMode {
    if (screenMode == BCOVPUIScreenModeNormal) {
        if (self.onBeforeExitFullscreen) {
            self.onBeforeExitFullscreen(@{});
        }
    } else if (screenMode == BCOVPUIScreenModeFull) {
        if (self.onBeforeEnterFullscreen) {
            self.onBeforeEnterFullscreen(@{});
        }
    }
}

- (void)playerView:(BCOVPUIPlayerView *)playerView didTransitionToScreenMode:(BCOVPUIScreenMode)screenMode {
    if (screenMode == BCOVPUIScreenModeNormal) {
        if (self.onExitFullscreen) {
            self.onExitFullscreen(@{});
        }
    } else if (screenMode == BCOVPUIScreenModeFull) {
        if (self.onEnterFullscreen) {
            self.onEnterFullscreen(@{});

            dispatch_async(dispatch_get_main_queue(), ^(void){
                [self createAirplayIconOverlay];
            });
        }
    }
}

- (void)playbackController:(id<BCOVPlaybackController>)controller didAdvanceToPlaybackSession:(id<BCOVPlaybackSession>)session {
    self.playbackSession = session;
}

#pragma mark - BCOVPUIPlayerViewDelegate

- (void)routePickerViewDidEndPresentingRoutes:(AVRoutePickerView *)routePickerView  API_AVAILABLE(ios(11.0)){
    [self createAirplayIconOverlay];
}

#pragma mark - Custom Methods

- (void)handleSeekToTimeTap:(UITapGestureRecognizer *)recognizer {
    if (recognizer.state == UIGestureRecognizerStateEnded) {
        CGPoint location = [recognizer locationInView:[recognizer.view superview]];

        double touchLocation = location.x / _playerView.controlsView.progressSlider.bounds.size.width;
        double percentage = [self calculateSeekTime:touchLocation];
        CMTime newTime = CMTimeMake(percentage * _segmentDuration, 1);

        [_playbackController seekToTime:CMTimeMakeWithSeconds(CMTimeGetSeconds(newTime), NSEC_PER_SEC) completionHandler:^(BOOL finished) {
            [_analytics handleSeek];
        }];
    }
}

- (void)createAirplayIconOverlay {
    if ([self isAudioSessionUsingAirplayOutputRoute]) {
        if (![_route isDescendantOfView:_playerView.controlsContainerView]) {
            if (@available(iOS 11.0, *)) {
                _route = [[AVRoutePickerView alloc] init];
            } else {
                // Fallback on earlier versions
            }
            _route.backgroundColor = [UIColor clearColor];
            _route.tintColor = [UIColor clearColor];
            _route.activeTintColor = [UIColor colorWithWhite:1.0 alpha:1.0];
            [_route setTranslatesAutoresizingMaskIntoConstraints:NO];

            [_playerView.controlsContainerView addSubview:_route];
            [_playerView.controlsContainerView sendSubviewToBack:_route];

            _centreHorizontallyConstraint = [NSLayoutConstraint constraintWithItem:_route
                                                                attribute:NSLayoutAttributeCenterX
                                                                relatedBy:NSLayoutRelationEqual
                                                                toItem:_playerView.controlsContainerView
                                                                attribute:NSLayoutAttributeCenterX
                                                                multiplier:1.0
                                                                constant:0];

           _centreVerticallyConstraint = [NSLayoutConstraint constraintWithItem:_route
                                                             attribute:NSLayoutAttributeCenterY
                                                             relatedBy:NSLayoutRelationEqual
                                                             toItem:_playerView.controlsContainerView
                                                             attribute:NSLayoutAttributeCenterY
                                                             multiplier:1.0
                                                             constant:0];

            _widthConstraint = [NSLayoutConstraint constraintWithItem:_route attribute:NSLayoutAttributeWidth
                                                                             relatedBy:NSLayoutRelationEqual
                                                                             toItem:nil
                                                                             attribute:NSLayoutAttributeNotAnAttribute
                                                                             multiplier:1.0
                                                                             constant:200];

            _heightConstraint = [NSLayoutConstraint constraintWithItem:_route attribute:NSLayoutAttributeHeight
                                                                              relatedBy:NSLayoutRelationEqual
                                                                              toItem:nil
                                                                              attribute:NSLayoutAttributeNotAnAttribute
                                                                              multiplier:1.0
                                                                              constant:200];

            [_playerView.controlsContainerView addConstraints:@[_centreHorizontallyConstraint, _centreVerticallyConstraint,
                                                                _widthConstraint, _heightConstraint]];

            [self layoutIfNeeded];
        }
    } else {
        [self cleanRemoveFromSuperview:_route];
    }
}

- (void)cleanRemoveFromSuperview:(UIView *)view {
    if(!view || !view.superview) return;

    //First remove any constraints on the superview
    NSMutableArray * constraints_to_remove = [NSMutableArray new];
    UIView * superview = view.superview;

    for( NSLayoutConstraint * constraint in superview.constraints) {
        if( constraint.firstItem == view ||constraint.secondItem == view ) {
            [constraints_to_remove addObject:constraint];
        }
    }
    [superview removeConstraints:constraints_to_remove];

    //Then remove the view itself.
    [view removeFromSuperview];
}

- (BOOL)isAudioSessionUsingAirplayOutputRoute {
    /**
     * I found no other way to check if there is a connection to an airplay device
     * airPlayVideoActive is NO as long as the video hasn't started
     * and this method is true as soon as the device is connected to an airplay device
     */
    AVAudioSession* audioSession = [AVAudioSession sharedInstance];
    AVAudioSessionRouteDescription* currentRoute = audioSession.currentRoute;
    for (AVAudioSessionPortDescription* outputPort in currentRoute.outputs){
        if ([outputPort.portType isEqualToString:AVAudioSessionPortAirPlay])
            return YES;
    }
    return NO;
}

- (double)calculateSeekTime:(double)percentage {
    if (percentage > 1.0) {
        percentage = 1.0;
    } else if (percentage < 0.0) {
        percentage = 0.0;
    }

    return percentage;
}

- (void)emitError:(NSError *)error {

    if (!self.onError) {
        return;
    }

    NSString *code = [NSString stringWithFormat:@"%ld", (long)[error code]];

    [_analytics handleError:code];

    self.onError(@{kErrorCodeKey: code, kMessageKey: [error localizedDescription]});
}

- (void)refreshControlsView {
    dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(3.0 * NSEC_PER_SEC));
    dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
        _playerView.controlsFadingViewVisible = !_playerView.controlsFadingViewVisible;
    });
}

#pragma mark - AkamaiPlayerDataProtocol

- (double)streamHeadPosition {
    return CMTimeGetSeconds(playbackSession.player.currentTime) * 1000;
}

- (int64_t)bytesLoaded {
    long bytes = 0;
    AVPlayerItemAccessLog *accessLog = [playbackSession.player.currentItem accessLog];

    if (accessLog != nil) {
        if (accessLog.events.count > 0) {
            if (accessLog.events[accessLog.events.count-1].numberOfBytesTransferred > _currentBytesLoaded) {
                bytes = accessLog.events[accessLog.events.count-1].numberOfBytesTransferred - _currentBytesLoaded;
            }
            _currentBytesLoaded = accessLog.events[accessLog.events.count-1].numberOfBytesTransferred;
        }
    }

    return bytes;
}

- (NSInteger)droppedFrames {
    NSInteger df = 0;
    AVPlayerItemAccessLog *accessLog = [playbackSession.player.currentItem accessLog];

    if (accessLog != nil) {
        if (accessLog.events.count > 0) {
            df = accessLog.events[accessLog.events.count-1].numberOfDroppedVideoFrames - _currentDroppedFrames;
            _currentDroppedFrames = accessLog.events[accessLog.events.count-1].numberOfDroppedVideoFrames;
        }
    }
    return df;
}
@end
