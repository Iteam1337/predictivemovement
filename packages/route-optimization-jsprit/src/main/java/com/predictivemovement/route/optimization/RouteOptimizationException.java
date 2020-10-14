package com.predictivemovement.route.optimization;

/**
 * This class adds some more information to an exception.
 */
public class RouteOptimizationException extends Exception {

    private static final long serialVersionUID = 1L;

    public StatusResponse.Type status;
    public String statusMsg = "";
    public String message = "";
    public String source = "";
    public String detail = "";
    public String meta = "";

    public RouteOptimizationException(StatusResponse.Type status) {
        super();
        this.status = status;
    }

    public RouteOptimizationException(Exception ex, StatusResponse.Type status) {
        super(ex);
        this.status = status;
    }

    public RouteOptimizationException setStatusMsg(String statusMsg) {
        this.statusMsg = statusMsg;
        return this;
    }

    public RouteOptimizationException setMessage(String message) {
        this.message = message;
        return this;
    }

    public RouteOptimizationException setSource(String source) {
        this.source = source;
        return this;
    }

    public RouteOptimizationException setDetail(String detail) {
        this.detail = detail;
        return this;
    }

    public RouteOptimizationException setMeta(String meta) {
        this.meta = meta;
        return this;
    }
}