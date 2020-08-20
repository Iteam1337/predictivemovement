package com.predictivemovement.route.optimization;

import com.graphhopper.jsprit.core.problem.solution.route.activity.TimeWindow;
import org.json.JSONArray;
import org.json.JSONObject;

import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.function.Consumer;

/**
 * This class adds time windows for pickup and/or delivery to shipments.
 */
public class VRPSettingTimeUtils {

    ZonedDateTime now;

    public VRPSettingTimeUtils() {
        now = ZonedDateTime.now();
    }

    public double getTimeDifferenceFromNow(JSONObject json, String field, double defaultSeconds) {
        if (!json.has(field))
            return defaultSeconds;

        String dateTimeString = json.optString(field);
        if (dateTimeString.isBlank()) return defaultSeconds;

        ZonedDateTime dateTime = ZonedDateTime.parse(dateTimeString);
        double seconds = ChronoUnit.SECONDS.between(now, dateTime);

        // TODO should throw an error because time window is not possible anymore?
        seconds = seconds > 0 ? seconds : defaultSeconds;

        return seconds;
    }
}