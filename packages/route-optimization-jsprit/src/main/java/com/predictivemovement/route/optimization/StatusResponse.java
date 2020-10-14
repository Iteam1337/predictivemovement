package com.predictivemovement.route.optimization;

import static com.predictivemovement.route.optimization.StatusResponse.Type.SUCCESSS;
import static com.predictivemovement.route.optimization.StatusResponse.Type.FAILURE;

import org.json.JSONObject;

/**
 * This class...
 */
public class StatusResponse {

    public enum Type {

        SUCCESSS("success"), FAILURE("failure"), ERROR("error");

        public final String status;

        private Type(String status) {
            this.status = status;
        }
    }

    VRPSolution vrpSolution;

    JSONObject status;

    JSONObject data;

    public StatusResponse(JSONObject data) {
        this.data = data;
        createStatusResponse();
    }

    public StatusResponse(VRPSolution vrpSolution) {
        this.vrpSolution = vrpSolution;

        JSONObject routeSolution = new RouteOptimizationResponse(vrpSolution).toJson();
        this.data = routeSolution;

        createStatusResponse();
    }

    private void createStatusResponse() {
        status = new JSONObject();

        status.put("data", this.data);

        if (vrpSolution != null && vrpSolution.excludedBookings.hasEntires()) {
            status.put("status", FAILURE.status);
            status.put("status_msg", "Some bookings are excluded!");
        } else {
            status.put("status", SUCCESSS.status);
            status.put("status_msg", "well done");
        }
    }

    @Override
    public String toString() {
        return status.toString();
    }
}
