package com.predictivemovement.route.optimization;

import com.graphhopper.jsprit.core.problem.Location;
import com.graphhopper.jsprit.core.problem.job.Activity;
import com.graphhopper.jsprit.core.problem.job.Job;
import com.graphhopper.jsprit.core.problem.solution.VehicleRoutingProblemSolution;
import com.graphhopper.jsprit.core.problem.solution.route.VehicleRoute;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * This class converts a VRPSolution into a JSON response.
 */
public class RouteOptimizationResponse {

    private int routeCounter;

    private VehicleRoutingProblemSolution solution;

    RouteOptimizationResponse(VRPSolution vrpSolution) {
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

        for (Job job : vehicleRoute.getTourActivities().getJobs()) {
            for (Activity activity : job.getActivities()) {
                activities.put(activity(job, activity));
            }
        }

        activities.put(activityEnd(vehicleRoute));

        return activities;
    }

    private JSONObject activityStart(VehicleRoute vehicleRoute) {
        JSONObject activity = new JSONObject();
        activity.put("type", vehicleRoute.getStart().getName());
        activity.put("address", getAddress(vehicleRoute.getStart().getLocation()));
        return activity;
    }

    private JSONObject activity(Job job, Activity activity) {
        JSONObject jsonActivity = new JSONObject();
        jsonActivity.put("type", activity.getActivityType());
        jsonActivity.put("id", job.getId());
        jsonActivity.put("address", getAddress(activity.getLocation()));
        return jsonActivity;
    }

    private JSONObject activityEnd(VehicleRoute vehicleRoute) {
        JSONObject activity = new JSONObject();
        activity.put("type", vehicleRoute.getEnd().getName());
        activity.put("address", getAddress(vehicleRoute.getEnd().getLocation()));
        return activity;
    }

    private JSONObject getAddress(Location location) {
        JSONObject address = new JSONObject();
        address.put("lon", location.getCoordinate().getX());
        address.put("lat", location.getCoordinate().getY());
        return address;
    }
}