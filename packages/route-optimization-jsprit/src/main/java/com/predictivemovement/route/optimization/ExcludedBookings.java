package com.predictivemovement.route.optimization;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * This class keeps all bookings which are excluded from the current route.
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
