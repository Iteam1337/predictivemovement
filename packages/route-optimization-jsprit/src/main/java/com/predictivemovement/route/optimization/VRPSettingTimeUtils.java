package com.predictivemovement.route.optimization;

import org.json.JSONObject;

import java.time.*;
import java.time.temporal.ChronoUnit;

/**
 * This class provides time calculation functions.
 */

final class VehicleStartAndEndTimes {
    public final double earliestStart;
    public final double latestEnd;

    VehicleStartAndEndTimes(double earliestStart, double latestEnd) {
        this.earliestStart = earliestStart;
        this.latestEnd = latestEnd;
    }
}
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

    public VehicleStartAndEndTimes getVehicleStartAndEnd(JSONObject json) {
        if (!json.has("latest_end")) {
            return new VehicleStartAndEndTimes(defaultStart, defaultEnd);
        }

        String latestEndString = json.optString("latest_end");
        String[] latestEndParts = latestEndString.split(":");
        int latestEndHour = Integer.parseInt(latestEndParts[0]);
        int latestEndMinutes = Integer.parseInt(latestEndParts[1]);

        String earliestStartString = json.optString("latest_end");
        String[] earliestStartParts = earliestStartString.split(":");
        int earliestStartHour = Integer.parseInt(earliestStartParts[0]);
        int earliestStartMinutes = Integer.parseInt(earliestStartParts[1]);

        int currentHour = LocalDateTime.now().getHour();
        LocalDate latestEndDate = LocalDate.now();
        if (latestEndHour < currentHour) {
            latestEndDate = latestEndDate.plusDays(1);
        }

        LocalDateTime latestEndTime = LocalTime.of(latestEndHour, latestEndMinutes).atDate(latestEndDate);
        LocalDateTime earliestStartTime = LocalTime.of(earliestStartHour, earliestStartMinutes).atDate(latestEndDate);

        double earliestStart = Duration.between(localNow, earliestStartTime).toSeconds();
        double latestEnd = Duration.between(localNow, latestEndTime).toSeconds();

        return new VehicleStartAndEndTimes(earliestStart, latestEnd);
    }

    public double getTimeDifferenceFromNow(JSONObject json, String field, double defaultSeconds) {
        if (!json.has(field))
            return defaultSeconds;

        String dateTimeString = json.optString(field);
        if (dateTimeString.isBlank())
            return defaultSeconds;

        ZonedDateTime dateTime = ZonedDateTime.parse(dateTimeString);
        double seconds = ChronoUnit.SECONDS.between(zonedNow, dateTime);

        // TODO should throw an error because time window is not possible anymore?
        seconds = seconds > 0 ? seconds : defaultSeconds;

        return seconds;
    }
}