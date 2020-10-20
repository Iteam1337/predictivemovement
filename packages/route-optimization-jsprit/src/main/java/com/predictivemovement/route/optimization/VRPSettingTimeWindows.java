package com.predictivemovement.route.optimization;

import java.util.function.Consumer;

import com.graphhopper.jsprit.core.problem.solution.route.activity.TimeWindow;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * This class adds time windows for pickup and/or delivery to shipments.
 */
public class VRPSettingTimeWindows {

    public void add(JSONObject json, Consumer<TimeWindow> addTimeWindowFunction) throws RouteOptimizationException {

        if (!json.has("time_windows"))
            return;

        VRPSettingTimeUtils timeUtils = new VRPSettingTimeUtils();

        JSONArray timeWindows = json.getJSONArray("time_windows");
        for (Object window : timeWindows) {
            JSONObject jsonTimeWindow = (JSONObject) window;

            double earliest = timeUtils.getTimeDifferenceFromNow(jsonTimeWindow, "earliest", 0.0);
            double latest = timeUtils.getTimeDifferenceFromNow(jsonTimeWindow, "latest", Double.MAX_VALUE);

            TimeWindow timeWindow = new TimeWindow(earliest, latest);
            addTimeWindowFunction.accept(timeWindow);
        }
    }
}