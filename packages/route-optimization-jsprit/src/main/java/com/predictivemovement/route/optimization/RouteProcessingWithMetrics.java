package com.predictivemovement.route.optimization;

import com.predictivemovement.route.optimization.metrics.BookingMetrics;
import com.predictivemovement.route.optimization.metrics.OSWatch;
import com.predictivemovement.route.optimization.metrics.Stopwatch;

import org.json.JSONObject;

/**
 * Process route optimization request including metrics as metadata. It's
 * wrapped to easily remove metrics if metrics will be provided by the
 * infrastructure.
 */
public class RouteProcessingWithMetrics implements RouteProcessing {

    VRPSolution vrpSolution;

    StatusResponse statusResponse;

    public void calculate(JSONObject routeRequest) throws RouteOptimizationException {
        Stopwatch stopwatch = new Stopwatch();
        stopwatch.start();

        OSWatch osWatch = new OSWatch();
        try {
            Thread thread = new Thread(osWatch);
            thread.start();

            RouteOptimization routeOptimization = new RouteOptimization();
            vrpSolution = routeOptimization.calculate(routeRequest);
            statusResponse = new StatusResponse(vrpSolution);

            stopwatch.stop();

            //
            JSONObject metrics = new JSONObject();

            //
            metrics.put("calculation_time", stopwatch.getRuntimeFormatted());

            //
            BookingMetrics bookingMetrics = new BookingMetrics(routeRequest);
            metrics.put("booking_metrics", bookingMetrics.data);

            //
            osWatch.stop();
            try {
                thread.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            metrics.put("os", osWatch.metrics);

            statusResponse.data.put("metrics", metrics);
        } finally {
            osWatch.stop();
        }
    }

    public VRPSolution getVRPSolution() {
        return vrpSolution;
    }

    public StatusResponse getStatusResponse() {
        return statusResponse;
    }
}