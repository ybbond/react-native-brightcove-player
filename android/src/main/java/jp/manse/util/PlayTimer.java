package jp.manse.util;

public class PlayTimer {
    public int elapsedTime = 0;
    private long startTime;

    public void start() {
        startTime = System.currentTimeMillis();
    }

    public void pause() {
        long currentTime = System.currentTimeMillis();
        if (startTime > 0) {
            elapsedTime += (currentTime - startTime) / 1000.0;
        }
        startTime = 0;
    }

    public int getElapsedTime() {
        return elapsedTime;
    }

    public void stop() {
        elapsedTime = 0;
        startTime = 0;
    }
}
