package com.predictivemovement.route.optimization;

import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.function.Consumer;

import com.graphhopper.jsprit.core.problem.solution.route.activity.TimeWindow;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * This class adds time windows for pickup and/or delivery to shipments.
 */
public class VRPSettingTimeWindows {

    ZonedDateTime now;

    public VRPSettingTimeWindows() {
        now = ZonedDateTime.now();
    }

    public void add(JSONObject json, Consumer<TimeWindow> addTimeWindowFunction) {

        if (!json.has("time_windows"))
            return;

        JSONArray timeWindows = json.getJSONArray("time_windows");
        for (Object window : timeWindows) {
            JSONObject jsonTimeWindow = (JSONObject) window;

            double earliest = getTimeDifferenceFromNow(jsonTimeWindow, "earliest", 0.0);
            double latest = getTimeDifferenceFromNow(jsonTimeWindow, "latest", Double.MAX_VALUE);

            TimeWindow timeWindow = new TimeWindow(earliest, latest);
            addTimeWindowFunction.accept(timeWindow);
        }
    }

    private double getTimeDifferenceFromNow(JSONObject jsonTimeWindow, String field, double defaultSeconds) {

        if (!jsonTimeWindow.has(field))
            return defaultSeconds;

        String dateTimeString = jsonTimeWindow.getString(field);
        ZonedDateTime dateTime = ZonedDateTime.parse(dateTimeString);
        double seconds = ChronoUnit.SECONDS.between(now, dateTime);

        // TODO should throw an error because time window is not possible anymore?
        seconds = seconds > 0 ? seconds : defaultSeconds;

        return seconds;
    }
}