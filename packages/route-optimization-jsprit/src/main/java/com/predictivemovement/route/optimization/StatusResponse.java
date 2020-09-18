package com.predictivemovement.route.optimization;

import static com.predictivemovement.route.optimization.StatusResponse.Type.SUCCESSS;

import org.json.JSONObject;

/**
 * This class...
 */
public class StatusResponse {

    public enum Type {

        SUCCESSS("success"), FAIL("fail"), ERROR("error");

        public final String status;

        private Type(String status) {
            this.status = status;
        }
    }

    JSONObject status;

    JSONObject data;

    public StatusResponse(JSONObject data) {
        this.data = data;
        createStatusResponse();
    }

    private void createStatusResponse() {
        status = new JSONObject();
        status.put("data", data);
        status.put("status", SUCCESSS.status);
        status.put("status_code", "200");
        status.put("status_msg", "well done");
    }

    @Override
    public String toString() {
        return status.toString();
    }
}
