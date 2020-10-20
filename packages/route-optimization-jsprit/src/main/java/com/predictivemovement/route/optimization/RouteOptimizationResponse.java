package com.predictivemovement.route.optimization;

import com.graphhopper.jsprit.core.problem.Location;
import com.graphhopper.jsprit.core.problem.solution.VehicleRoutingProblemSolution;
import com.graphhopper.jsprit.core.problem.solution.route.VehicleRoute;
import com.graphhopper.jsprit.core.problem.solution.route.activity.DeliverShipment;
import com.graphhopper.jsprit.core.problem.solution.route.activity.PickupShipment;
import com.graphhopper.jsprit.core.problem.solution.route.activity.TourActivity;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * This class converts a VRPSolution into a JSON response.
 */
public class RouteOptimizationResponse {

    private int routeCounter;
    private int activityCounter;

    private VRPSolution vrpSolution;
    private VehicleRoutingProblemSolution solution;

    RouteOptimizationResponse(VRPSolution vrpSolution) {
        this.vrpSolution = vrpSolution;
        solution = vrpSolution.bestSolution;
    }

    JSONObject toJson() {
        JSONObject response = new JSONObject();
        response.put("solution", solution());
        return response;
    }

    private JSONObject solution() {
        JSONObject solution = new JSONObject();
        solution.put("routes", routes());
        solution.put("excluded", excluded());
        return solution;
    }

    private JSONArray routes() {
        JSONArray routes = new JSONArray();

        routeCounter = 0;
        for (VehicleRoute vehicleRoute : solution.getRoutes()) {
            routes.put(route(vehicleRoute));
        }

        return routes;
    }

    private JSONObject route(VehicleRoute vehicleRoute) {
        routeCounter++;

        JSONObject route = new JSONObject();
        route.put("number", routeCounter);
        route.put("vehicle_id", vehicleRoute.getVehicle().getId());
        route.put("activities", activities(vehicleRoute));

        return route;
    }

    private JSONArray activities(VehicleRoute vehicleRoute) {
        JSONArray activities = new JSONArray();

        activities.put(activityStart(vehicleRoute));

        activityCounter = 0;
        for (TourActivity activity : vehicleRoute.getActivities()) {
            activities.put(activity(activity));
        }
        activities.put(activityEnd(vehicleRoute));

        return activities;
    }

    private JSONObject activityStart(VehicleRoute vehicleRoute) {
        JSONObject activity = new JSONObject();
        activity.put("type", vehicleRoute.getStart().getName());
        activity.put("index", vehicleRoute.getStart().getIndex());
        activity.put("address", getAddress(vehicleRoute.getStart().getLocation()));
        return activity;
    }

    private JSONObject activity(TourActivity activity) {
        activityCounter++;

        JSONObject jsonActivity = new JSONObject();
        jsonActivity.put("type", activity.getName());
        jsonActivity.put("index", activityCounter);

        if (activity instanceof PickupShipment) {
            PickupShipment pickup = (PickupShipment) activity;
            jsonActivity.put("id", pickup.getJob().getId());
        } else if (activity instanceof DeliverShipment) {
            DeliverShipment delivery = (DeliverShipment) activity;
            jsonActivity.put("id", delivery.getJob().getId());
        }

        jsonActivity.put("address", getAddress(activity.getLocation()));
        return jsonActivity;
    }

    private JSONObject activityEnd(VehicleRoute vehicleRoute) {
        JSONObject activity = new JSONObject();
        activity.put("type", vehicleRoute.getEnd().getName());
        activity.put("index", vehicleRoute.getEnd().getIndex());
        activity.put("address", getAddress(vehicleRoute.getEnd().getLocation()));
        return activity;
    }

    private JSONObject getAddress(Location location) {
        JSONObject address = new JSONObject();
        address.put("lon", location.getCoordinate().getX());
        address.put("lat", location.getCoordinate().getY());
        return address;
    }

    private JSONArray excluded() {
        ExcludedBookings excludedBookings = vrpSolution.excludedBookings;
        JSONArray excludeResponse = excludedBookings.toJsonArray();
        return excludeResponse;
    }
}