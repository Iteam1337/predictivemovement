package com.predictivemovement.route.optimization;

import org.json.JSONObject;

/**
 * This class processes route requests.
 */
public class RouteOptimization {

  public VRPSolution calculate(JSONObject routeRequest) throws RouteOptimizationException {
    VRPVehiclesTypes.clearCache();

    VRPSetting vrpProblem = new VRPSetting(routeRequest).set();
    VRPSolution vrpSolution = new VRPSolution(vrpProblem).calculate();

    return vrpSolution;
  }
}