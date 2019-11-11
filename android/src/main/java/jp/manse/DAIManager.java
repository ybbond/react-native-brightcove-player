package jp.manse;

import android.content.Context;
import android.util.Log;
import android.view.ViewGroup;

import com.brightcove.player.model.DeliveryType;
import com.brightcove.player.model.Video;
import com.brightcove.player.view.BrightcoveExoPlayerVideoView;
import com.google.ads.interactivemedia.v3.api.AdErrorEvent;
import com.google.ads.interactivemedia.v3.api.AdEvent;
import com.google.ads.interactivemedia.v3.api.AdsLoader;
import com.google.ads.interactivemedia.v3.api.ImaSdkFactory;
import com.google.ads.interactivemedia.v3.api.StreamDisplayContainer;
import com.google.ads.interactivemedia.v3.api.StreamRequest;
import com.google.ads.interactivemedia.v3.api.player.VideoProgressUpdate;
import com.google.ads.interactivemedia.v3.api.player.VideoStreamPlayer;

import java.util.HashMap;
import java.util.List;

import jp.manse.util.Configuration;

public class DAIManager implements AdEvent.AdEventListener, AdErrorEvent.AdErrorListener {
    private BrightcoveExoPlayerVideoView videoPlayer;
    private ImaSdkFactory sdkFactory = ImaSdkFactory.getInstance();
    private AdsLoader adsLoader;
    private StreamDisplayContainer displayContainer;

    public DAIManager(Context context, ViewGroup adUiContainer, BrightcoveExoPlayerVideoView videoPlayer) {
        this.videoPlayer = videoPlayer;
        this.displayContainer = sdkFactory.createStreamDisplayContainer();
        displayContainer.setVideoStreamPlayer(videoStreamPlayer);
        displayContainer.setAdContainer(adUiContainer);
        adsLoader = sdkFactory.createAdsLoader(context, sdkFactory.createImaSdkSettings(), displayContainer);
    }

    @Override
    public void onAdError(AdErrorEvent adErrorEvent) {
        Log.d("DAIManager", "Event: " + adErrorEvent.toString());
    }

    @Override
    public void onAdEvent(AdEvent adEvent) {
        Log.d("DAIManager", "Error: " + adEvent.toString());
    }

    private VideoStreamPlayer videoStreamPlayer = new VideoStreamPlayer() {
        @Override
        public void loadUrl(String url, List<HashMap<String, String>> list) {
            if (url != null) {
                Video video = Video.createVideo(url, DeliveryType.HLS);
                videoPlayer.clear();
                videoPlayer.add(video);
                videoPlayer.start();
            }
        }

        @Override
        public int getVolume() {
            return 1;
        }

        @Override
        public void addCallback(VideoStreamPlayerCallback videoStreamPlayerCallback) {

        }

        @Override
        public void removeCallback(VideoStreamPlayerCallback videoStreamPlayerCallback) {

        }

        @Override
        public void onAdBreakStarted() {

        }

        @Override
        public void onAdBreakEnded() {

        }

        @Override
        public void onAdPeriodStarted() {

        }

        @Override
        public void onAdPeriodEnded() {

        }

        @Override
        public void seek(long l) {

        }

        @Override
        public VideoProgressUpdate getContentProgress() {
            return new VideoProgressUpdate(new Long(videoPlayer.getCurrentPosition()), new Long(videoPlayer.get(0).getDuration()));
        }
    };

    public void requestAndPlayAds() {
        adsLoader.addAdErrorListener(this);
        adsLoader.requestStream(buildStreamRequest());
    }

    private StreamRequest buildStreamRequest() {
        return sdkFactory.createLiveStreamRequest(Configuration.DAI_ASSET_KEY, null);
    }

}
