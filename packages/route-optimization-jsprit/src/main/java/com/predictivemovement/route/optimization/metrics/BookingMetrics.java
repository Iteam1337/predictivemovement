package com.predictivemovement.route.optimization.metrics;

import org.json.JSONObject;

/**
 * This class...
 */
public class BookingMetrics {

    public JSONObject data;

    public BookingMetrics(JSONObject routeRequest) {
        data = new JSONObject();
        data.put("number_of_vehicles", routeRequest.getJSONArray("vehicles").length());
        data.put("number_of_bookings", routeRequest.getJSONArray("bookings").length());
    }
}