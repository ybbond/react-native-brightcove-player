package jp.manse.chromecast;

import android.content.Context;

import com.brightcove.cast.controller.BrightcoveCastMediaManager;
import com.brightcove.player.event.EventEmitter;

public class FCBrightcoveCastMediaManager extends BrightcoveCastMediaManager {
    public FCBrightcoveCastMediaManager(Context context, EventEmitter eventEmitter) {
        super(context, eventEmitter);
    }
}
