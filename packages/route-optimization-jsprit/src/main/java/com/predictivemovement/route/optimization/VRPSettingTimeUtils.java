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
        try {
            String latestEndString = json.getString("latest_end");
            String earliestStartString = json.getString("earliest_start");
            int currentHour = LocalDateTime.now().getHour();
            LocalDate latestEndDate = LocalDate.now();

            // if the latest end hour is before current hour move window tomorrow
            if (LocalTime.parse(latestEndString).getHour() < currentHour) {
                latestEndDate = latestEndDate.plusDays(1);
            }

            LocalDateTime latestEndTime = LocalTime.parse(latestEndString).atDate(latestEndDate);
            LocalDateTime earliestStartTime = LocalTime.parse(earliestStartString).atDate(latestEndDate);

            double earliestStart = Duration.between(localNow, earliestStartTime).toSeconds();
            double latestEnd = Duration.between(localNow, latestEndTime).toSeconds();

            return new VehicleStartAndEndTimes(earliestStart > 0 ? earliestStart : defaultStart, latestEnd);

        } catch (Exception e) {
            return new VehicleStartAndEndTimes(defaultStart, defaultEnd);
        }
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