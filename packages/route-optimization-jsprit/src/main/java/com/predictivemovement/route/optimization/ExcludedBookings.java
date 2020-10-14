package com.predictivemovement.route.optimization;

import java.util.ArrayList;
import java.util.List;

import com.graphhopper.jsprit.core.problem.job.Activity;
import com.graphhopper.jsprit.core.problem.job.Job;
import com.graphhopper.jsprit.core.problem.job.Activity.Type;
import com.graphhopper.jsprit.core.problem.solution.route.activity.TimeWindow;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * This class keeps all bookings which are excluded from the current route.
 * 
 * TODO Do we need all the information or is ID just enough?
 */
public class ExcludedBookings {

    List<JSONObject> bookings = new ArrayList<>();

    public void add(JSONObject jsonBooking, RouteOptimizationException ex) {

        JSONObject failure = new JSONObject();
        failure.put("status", ex.status);
        failure.put("status_msg", ex.statusMsg);
        failure.put("message", ex.message);
        failure.put("detail", ex.detail);
        failure.put("source", ex.source);
        failure.put("meta", ex.meta);

        jsonBooking.put("failure", failure);

        bookings.add(jsonBooking);
    }

    public void add(Job job) {
        JSONObject booking = new JSONObject();
        booking.put("id", job.getId());

        // TODO no support for more than one pickup or delivery in one booking!
        for (Activity activity : job.getActivities()) {

            JSONObject jsonActivity = new JSONObject();
            jsonActivity.put("lon", activity.getLocation().getCoordinate().getX());
            jsonActivity.put("lat", activity.getLocation().getCoordinate().getY());

            // TODO not possible to recalculate exact request time! Alternative go for json
            // request by ID.
            if (activity.getTimeWindows().size() > 0) {
                JSONArray jsonTimeWindows = new JSONArray();
                for (TimeWindow timeWindow : activity.getTimeWindows()) {
                    JSONObject jsonTimeWindow = new JSONObject();
                    jsonTimeWindow.put("earliest", timeWindow.getStart());
                    jsonTimeWindow.put("latest", timeWindow.getEnd());
                    jsonTimeWindows.put(jsonTimeWindow);
                }
                // TODO excluded because of test ability
                // jsonActivity.put("time_windows", jsonTimeWindows);
            }

            if (activity.getActivityType().equals(Type.PICKUP)) {
                booking.put("pickup", jsonActivity);
            } else if (activity.getActivityType().equals(Type.DELIVERY)) {
                booking.put("delivery", jsonActivity);
            }
        }

        bookings.add(booking);
    }

    public JSONArray toJsonArray() {
        JSONArray jsonArray = new JSONArray();
        for (JSONObject booking : bookings) {
            jsonArray.put(booking);
        }
        return jsonArray;
    }

    public boolean hasEntires() {
        return bookings.size() > 0;
    }
}
