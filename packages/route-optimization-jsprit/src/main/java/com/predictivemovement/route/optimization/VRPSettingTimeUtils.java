package com.predictivemovement.route.optimization;

import org.json.JSONObject;

import java.time.*;
import java.time.temporal.ChronoUnit;

import static com.predictivemovement.route.optimization.StatusResponse.Type.ERROR;
import static com.predictivemovement.route.optimization.StatusResponse.Type.FAILURE;

/**
 * Data object to carry a time range, start to end.
 */
final class VehicleStartAndEndTimes {
    public LocalDateTime earliestStartTime;
    public Double earliestStart;

    public LocalDateTime latestEndTime;
    public Double latestEnd;

    public boolean isSet() {
        return (earliestStart != null && latestEnd != null);
    }
}

/**
 * This class provides time calculation functions.
 */
public class VRPSettingTimeUtils {

    LocalDateTime localNow;
    ZonedDateTime zonedNow;

    double defaultStart;

    double defaultEnd;

    public VRPSettingTimeUtils() {
        localNow = LocalDateTime.now();
        zonedNow = ZonedDateTime.now();
        defaultStart = 0.0;
        defaultEnd = Double.MAX_VALUE;
    }

    public VehicleStartAndEndTimes getVehicleStartAndEnd(JSONObject json) throws RouteOptimizationException {
        try {
            VehicleStartAndEndTimes startAndEndTimes = new VehicleStartAndEndTimes();

            if (json.has("earliest_start") && json.has("latest_end")) {

                // parse to current date with hours
                final String earliestStartString = json.getString("earliest_start");
                LocalDateTime earliestStartTime = localNow.with(LocalTime.parse(earliestStartString));

                final String latestEndString = json.getString("latest_end");
                LocalDateTime latestEndTime = localNow.with(LocalTime.parse(latestEndString));

                // time range is going over two days, e.g. 22:00 to 06:00 next day
                if (earliestStartTime.isAfter(latestEndTime)) {
                    latestEndTime = latestEndTime.plusDays(1);
                }

                // if the end time is in the past, move the time range to the next day
                if (latestEndTime.isBefore(localNow)) {
                    earliestStartTime = earliestStartTime.plusDays(1);
                    latestEndTime = latestEndTime.plusDays(1);
                }

                // set to data object
                startAndEndTimes.earliestStartTime = earliestStartTime;
                startAndEndTimes.earliestStart = (double) Duration.between(localNow, earliestStartTime).toSeconds();
                if (startAndEndTimes.earliestStart < 0)
                    startAndEndTimes.earliestStart = 0.0;

                startAndEndTimes.latestEndTime = latestEndTime;
                startAndEndTimes.latestEnd = (double) Duration.between(localNow, latestEndTime).toSeconds();
            }
            return startAndEndTimes;
        } catch (Exception ex) {
            throw new RouteOptimizationException(ex, ERROR).setStatusMsg("Could not set Vehicle start and end time!")
                    .setMessage(ex.getMessage()).setDetail("earliest_start/latest_end has to be in format 11:00")
                    .setMeta(json.toString());
        }
    }

    public double getTimeDifferenceFromNow(final JSONObject json, final String field, final double defaultSeconds)
            throws RouteOptimizationException {
        if (!json.has(field))
            return defaultSeconds;

        final String dateTimeString = json.optString(field);
        if (dateTimeString.isBlank())
            return defaultSeconds;

        final ZonedDateTime dateTime = ZonedDateTime.parse(dateTimeString);
        double seconds = ChronoUnit.SECONDS.between(zonedNow, dateTime);

        if (seconds <= 0) {
            throw new RouteOptimizationException(FAILURE).setStatusMsg("Time of time window constraint is in the past!")
                    .setSource(this.getClass().toString())
                    // .setDetail("Difference to current time " + zonedNow + " in seconds is " +
                    // seconds)
                    .setMeta(json.toString());
        }

        return seconds;
    }
}