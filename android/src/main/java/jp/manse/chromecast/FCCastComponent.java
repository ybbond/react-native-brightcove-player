package jp.manse.chromecast;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

import com.brightcove.cast.GoogleCastComponent;
import com.brightcove.cast.controller.BrightcoveCastMediaManager;
import com.brightcove.player.event.EventEmitter;

public class FCCastComponent extends GoogleCastComponent {
    public FCCastComponent(@NonNull EventEmitter emitter, @NonNull Context context) {
        super(emitter, context);
    }

    public FCCastComponent(@NonNull EventEmitter emitter, @NonNull Context context, @Nullable BrightcoveCastMediaManager brightcoveCastMediaManager) {
        super(emitter, context, brightcoveCastMediaManager);
    }
}
