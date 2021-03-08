package com.predictivemovement.route.optimization;

import org.json.JSONObject;

/**
 * Basic process route optimization.
 */
public class RouteProcessingBasic implements RouteProcessing {

    VRPSolution vrpSolution;

    StatusResponse statusResponse;

    public void calculate(JSONObject routeRequest) throws RouteOptimizationException {
        RouteOptimization routeOptimization = new RouteOptimization();
        vrpSolution = routeOptimization.calculate(routeRequest);
        statusResponse = new StatusResponse(vrpSolution);
    }

    public VRPSolution getVRPSolution() {
        return vrpSolution;
    }

    public StatusResponse getStatusResponse() {
        return statusResponse;
    }
}