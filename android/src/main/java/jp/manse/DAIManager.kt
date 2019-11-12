package jp.manse

import android.content.Context
import android.util.Log
import android.view.ViewGroup
import com.brightcove.player.model.DeliveryType
import com.brightcove.player.model.Video
import com.brightcove.player.view.BrightcoveExoPlayerVideoView
import com.google.ads.interactivemedia.v3.api.AdErrorEvent
import com.google.ads.interactivemedia.v3.api.AdEvent
import com.google.ads.interactivemedia.v3.api.AdsLoader
import com.google.ads.interactivemedia.v3.api.ImaSdkFactory
import com.google.ads.interactivemedia.v3.api.StreamDisplayContainer
import com.google.ads.interactivemedia.v3.api.StreamRequest
import jp.manse.util.Configuration
import com.google.ads.interactivemedia.v3.api.player.VideoStreamPlayer
import com.google.ads.interactivemedia.v3.api.player.VideoProgressUpdate


class DAIManager(private val context: Context,
                 private val adUiContainer: ViewGroup,
                 private val videoPlayer: BrightcoveExoPlayerVideoView
) : AdEvent.AdEventListener, AdErrorEvent.AdErrorListener {

    private val sdkFactory: ImaSdkFactory = ImaSdkFactory.getInstance()
    private lateinit var adsLoader: AdsLoader
    private var displayContainer: StreamDisplayContainer

    init {
        displayContainer = sdkFactory.createStreamDisplayContainer()
        createAdsLoader()
    }

    private fun createAdsLoader() {
        displayContainer = sdkFactory.createStreamDisplayContainer()
        val videoStreamPlayer = createVideoStreamPlayer()

        displayContainer.videoStreamPlayer = videoStreamPlayer
        displayContainer.adContainer = adUiContainer
        adsLoader = sdkFactory.createAdsLoader(context, sdkFactory.createImaSdkSettings(), displayContainer)
    }

    fun requestAndPlayAds() {
        adsLoader.addAdErrorListener(this)
        adsLoader.requestStream(buildStreamRequest())
    }

    private fun createVideoStreamPlayer() = object : VideoStreamPlayer {
            override fun onAdBreakEnded() {
            }

            override fun onAdBreakStarted() {
            }

            override fun seek(p0: Long) {
            }

            override fun getVolume(): Int {
                return 100
            }

            override fun removeCallback(p0: VideoStreamPlayer.VideoStreamPlayerCallback?) {
            }

            override fun onAdPeriodStarted() {
            }

            override fun loadUrl(url: String?, p1: MutableList<HashMap<String, String>>?) {
                Log.v("DAIMAN", ""+ url)
                if (url != null) {
                    val video = Video.createVideo(url, DeliveryType.HLS)
                    videoPlayer.clear()
                    videoPlayer.add(video)
                    videoPlayer.start()
                }
            }

            override fun addCallback(p0: VideoStreamPlayer.VideoStreamPlayerCallback?) {
            }

            override fun getContentProgress(): VideoProgressUpdate {
                return if (videoPlayer.duration <= 0) {
                    VideoProgressUpdate.VIDEO_TIME_NOT_READY
                } else {
                    VideoProgressUpdate(videoPlayer.currentPosition.toLong(),
                        videoPlayer.get(0).duration.toLong())
                }
            }

            override fun onAdPeriodEnded() {
            }

    }

    private fun buildStreamRequest(): StreamRequest {
        Log.v("DAIMAN", ""+ Configuration.DAI_ASSET_KEY)
        return sdkFactory.createLiveStreamRequest(Configuration.DAI_ASSET_KEY, null)
    }

    override fun onAdEvent(event: AdEvent?) {
        Log.d("DAIManager", "Event: " + event!!.type)
    }

    override fun onAdError(event: AdErrorEvent?) {
        Log.d("DAIManager", "Error: " + event!!.error.message)
    }
}
