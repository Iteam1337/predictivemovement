package com.predictivemovement.route.optimization;

import org.json.JSONObject;

/**
 * Added to allow different kind of processings; needed to add metrics. Can be
 * removed when there will be a better metric solution.
 */
public interface RouteProcessing {

    public void calculate(JSONObject routeRequest) throws RouteOptimizationException;

    public VRPSolution getVRPSolution();

    public StatusResponse getStatusResponse();
}
