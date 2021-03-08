package com.predictivemovement.route.optimization;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.json.JSONObject;

/**
 * Try out manually some performance measures.
 */
public class TryPerformanceMeasure {

    private JSONObject response;

    public static void main(final String args[]) throws Exception {

        // increase vehicles
        // String requestFile = "src/test/resources/metrics/vehicles/req_v68_b1.json";
        // String requestFile = "src/test/resources/metrics/vehicles/req_v137_b1.json";
        // String requestFile = "src/test/resources/metrics/vehicles/req_v205_b1.json";
        // String requestFile = "src/test/resources/metrics/vehicles/req_v274_b1.json";

        // increase bookings
        // String requestFile = "src/test/resources/metrics/bookings/req_v1_b34.json";
        // String requestFile = "src/test/resources/metrics/bookings/req_v1_b68.json";
        // String requestFile = "src/test/resources/metrics/bookings/req_v1_b102.json";
        // String requestFile = "src/test/resources/metrics/bookings/req_v1_b137.json";

        // mixed
        String requestFile = "src/test/resources/metrics/req_v1_b1.json";
        // String requestFile = "src/test/resources/metrics/req_v34_b120.json";
        // String requestFile = "src/test/resources/metrics/req_v68_b103.json";
        // String requestFile = "src/test/resources/metrics/req_v136_b69.json";
        // String requestFile = "src/test/resources/metrics/req_v205_b103.json";

        TryPerformanceMeasure tryOut = new TryPerformanceMeasure();
        try {
            tryOut.jsprit(requestFile);
        } catch (RouteOptimizationException exception) {
            String errorResponse = new ErrorResponse(exception).create();
            System.out.println(errorResponse);
            throw exception;
        }
    }

    public void jsprit(String requestFile) throws Exception {
        // given
        Path fileName = Path.of(requestFile);
        String msg = Files.readString(fileName);
        JSONObject routeRequest = new JSONObject(msg);

        // when
        RouteProcessing routeProcessing = new RouteProcessingWithMetrics();
        routeProcessing.calculate(routeRequest);
        StatusResponse statusResponse = routeProcessing.getStatusResponse();
        response = statusResponse.status;

        // then
        JSONObject metrics = response.getJSONObject("data").getJSONObject("metrics");
        System.out.println(metrics);
        String metricFilename = fileName.toString().replace(".json", "_metric.json");
        writeJsonFile(metrics, metricFilename);
    }

    private void writeJsonFile(JSONObject request, String filename) throws IOException {
        Path filepath = Paths.get(filename);
        Files.write(filepath, request.toString().getBytes());
    }
}