package com.predictivemovement.route.optimization;

import org.json.JSONObject;

/**
 * This class creates an error JSON response for a RouteOptimizationException.
 * https://github.com/omniti-labs/jsend https://jsonapi.org/format/#errors
 */
public class ErrorResponse {

    private RouteOptimizationException exception;

    protected StatusResponse response;

    public ErrorResponse(RouteOptimizationException exception) {
        this.exception = exception;
    }

    public String create() {

        JSONObject errorData = new JSONObject();
        errorData.put("error_msg", exception.getMessage());
        errorData.put("error_detail", exception.detail);
        errorData.put("error_source", exception.source);
        errorData.put("error_meta", exception.meta);

        response = new StatusResponse(errorData);
        response.status.put("status", exception.status.status);
        response.status.put("status_msg", exception.statusMsg);

        return response.toString();
    }
}
