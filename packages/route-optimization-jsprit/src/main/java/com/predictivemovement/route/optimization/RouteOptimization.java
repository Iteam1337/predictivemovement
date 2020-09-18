package com.predictivemovement.route.optimization;

import org.json.JSONObject;

/**
 * This class processes route requests.
 */
public class RouteOptimization {

  // to get access in test for plotting
  VRPSolution vrpSolution;

  public JSONObject calculate(JSONObject routeRequest) throws RouteOptimizationException {
    VRPSetting vrpProblem = new VRPSetting(routeRequest).set();
    vrpSolution = new VRPSolution(vrpProblem).calculate();
    JSONObject routeSolution = new RouteOptimizationResponse(vrpSolution).toJson();

    return routeSolution;
  }
}