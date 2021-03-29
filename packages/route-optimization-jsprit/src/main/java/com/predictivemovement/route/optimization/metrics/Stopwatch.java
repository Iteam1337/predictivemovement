package com.predictivemovement.route.optimization.metrics;

import java.time.Duration;
import java.time.Instant;

/**
 * This class can measure time between start and stop.
 */
public class Stopwatch {

    Instant startTime;
    Instant endTime;
    Duration duration;

    public void start() {
        startTime = Instant.now();
    }

    public void stop() {
        endTime = Instant.now();
        duration = Duration.between(startTime, endTime);
    }

    public String getRuntimeFormatted() {
        return String.format("%d:%02d:%02d", duration.toHours(), duration.toMinutesPart(), duration.toSecondsPart());
    }
}
